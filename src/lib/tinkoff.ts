// Интеграция с интернет-эквайрингом Т-Банка (Tinkoff) — схема «Платёжная форма банка».
// Мы создаём платёж (Init), получаем PaymentURL и редиректим покупателя на страницу банка.
// Данные карты вводятся на стороне Т-Банка — карты у нас не хранятся (без PCI DSS).
//
// Документация: https://www.tbank.ru/kassa/dev/payments/
// Реквизиты терминала берём из env (секреты), чтобы менять боевую кассу без правки кода.

import { createHash } from "crypto";
import type { OrderItem } from "@/lib/types";

const API_BASE = "https://securepay.tinkoff.ru/v2";

interface Creds {
  terminalKey: string;
  password: string;
}

function getCreds(): Creds {
  const terminalKey = process.env.TBANK_TERMINAL_KEY?.trim();
  const password = process.env.TBANK_PASSWORD?.trim();
  if (!terminalKey || !password) {
    throw new Error(
      "Не заданы реквизиты Т-Банка: проверьте TBANK_TERMINAL_KEY и TBANK_PASSWORD в env",
    );
  }
  return { terminalKey, password };
}

// Поля, которые НЕ участвуют в подписи Token (вложенные объекты/массивы и сам Token).
const TOKEN_EXCLUDED = new Set(["Token", "Receipt", "DATA", "Items", "Shops"]);

function scalarToString(value: unknown): string {
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

// Алгоритм Т-Банка: берём корневые скалярные поля, добавляем Password,
// сортируем ключи по алфавиту, конкатенируем значения, считаем SHA-256 (hex, lowercase).
export function generateToken(
  params: Record<string, unknown>,
  password: string,
): string {
  const entries: Array<[string, string]> = [["Password", password]];
  for (const [key, value] of Object.entries(params)) {
    if (TOKEN_EXCLUDED.has(key)) continue;
    if (value === undefined || value === null) continue;
    if (typeof value === "object") continue; // на всякий случай — только скаляры
    entries.push([key, scalarToString(value)]);
  }
  entries.sort(([a], [b]) => a.localeCompare(b));
  const concatenated = entries.map(([, v]) => v).join("");
  return createHash("sha256").update(concatenated, "utf8").digest("hex");
}

interface TinkoffResponse {
  Success: boolean;
  ErrorCode?: string;
  Message?: string;
  Details?: string;
  PaymentId?: string | number;
  Status?: string;
  PaymentURL?: string;
}

async function callApi(
  method: string,
  body: Record<string, unknown>,
): Promise<TinkoffResponse> {
  const res = await fetch(`${API_BASE}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Т-Банк ${method}: HTTP ${res.status}`);
  }
  return (await res.json()) as TinkoffResponse;
}

// Нормализуем телефон к виду +7XXXXXXXXXX для чека.
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return "+" + digits;
}

interface ReceiptItem {
  Name: string;
  Price: number; // копейки
  Quantity: number;
  Amount: number; // копейки = Price * Quantity
  Tax: string;
  PaymentMethod: string;
  PaymentObject: string;
}

interface Receipt {
  Taxation: string;
  Phone?: string;
  Email?: string;
  Items: ReceiptItem[];
}

// Чек 54-ФЗ собираем только если включён TBANK_SEND_RECEIPT.
function buildReceipt(items: OrderItem[], phone: string): Receipt | undefined {
  if (process.env.TBANK_SEND_RECEIPT !== "true") return undefined;
  const tax = process.env.TBANK_VAT || "none";
  const receiptItems: ReceiptItem[] = items.map((item) => {
    const price = Math.round(item.price * 100);
    return {
      Name: item.name.slice(0, 128),
      Price: price,
      Quantity: item.qty,
      Amount: price * item.qty,
      Tax: tax,
      PaymentMethod: "full_payment",
      PaymentObject: "commodity",
    };
  });
  return {
    Taxation: process.env.TBANK_TAXATION || "usn_income",
    Phone: normalizePhone(phone) || undefined,
    Items: receiptItems,
  };
}

export interface InitOrder {
  id: string;
  phone: string;
  items: OrderItem[];
}

export interface InitResult {
  paymentId: string;
  paymentUrl: string;
}

// Создаёт платёж в Т-Банке и возвращает ссылку на платёжную форму.
export async function initPayment(
  order: InitOrder,
  baseUrl: string,
): Promise<InitResult> {
  const { terminalKey, password } = getCreds();

  // Сумму берём из позиций (в копейках) — гарантирует совпадение с суммой чека.
  const amount = order.items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.qty,
    0,
  );
  if (amount <= 0) {
    throw new Error("Нулевая сумма заказа — оплата невозможна");
  }

  const base = baseUrl.replace(/\/+$/, "");
  const params: Record<string, unknown> = {
    TerminalKey: terminalKey,
    Amount: amount,
    OrderId: order.id,
    Description: `Заказ в BLISS brand`.slice(0, 250),
    SuccessURL: `${base}/cart/success?order=${order.id}`,
    FailURL: `${base}/cart/fail?order=${order.id}`,
    NotificationURL: `${base}/api/payment/notification`,
  };

  const body: Record<string, unknown> = {
    ...params,
    Token: generateToken(params, password),
  };

  const receipt = buildReceipt(order.items, order.phone);
  if (receipt) body.Receipt = receipt;

  const data = await callApi("Init", body);
  if (!data.Success || !data.PaymentURL || !data.PaymentId) {
    throw new Error(
      `Т-Банк отклонил создание платежа: ${data.Message || ""} ${data.Details || ""} (${data.ErrorCode || "?"})`.trim(),
    );
  }

  return { paymentId: String(data.PaymentId), paymentUrl: data.PaymentURL };
}

// Запрашивает текущий статус платежа (используется на странице возврата).
export async function getPaymentState(paymentId: string): Promise<string> {
  const { terminalKey, password } = getCreds();
  const params: Record<string, unknown> = {
    TerminalKey: terminalKey,
    PaymentId: paymentId,
  };
  const body = { ...params, Token: generateToken(params, password) };
  const data = await callApi("GetState", body);
  if (!data.Success || !data.Status) {
    throw new Error(
      `Т-Банк GetState: ${data.Message || ""} (${data.ErrorCode || "?"})`.trim(),
    );
  }
  return data.Status;
}

// Проверяет подпись входящего вебхука Notification.
export function verifyNotificationToken(
  body: Record<string, unknown>,
): boolean {
  const { password } = getCreds();
  const received = typeof body.Token === "string" ? body.Token.toLowerCase() : "";
  if (!received) return false;
  const expected = generateToken(body, password).toLowerCase();
  return received === expected;
}

// Маппинг статуса Т-Банка в наш paymentStatus.
export function mapPaymentStatus(tinkoffStatus: string): string {
  switch (tinkoffStatus) {
    case "CONFIRMED":
      return "paid";
    case "REJECTED":
    case "DEADLINE_EXPIRED":
    case "CANCELED":
      return "rejected";
    case "REFUNDED":
    case "PARTIAL_REFUNDED":
      return "refunded";
    default:
      return "pending";
  }
}
