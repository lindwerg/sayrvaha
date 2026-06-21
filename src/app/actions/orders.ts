"use server";

// Серверные действия для заказов.
// createOrderAction — ПУБЛИЧНЫЙ (вызывается из корзины без авторизации), поэтому:
//   • проверяем, что корзина включена в настройках;
//   • валидируем вход и honeypot;
//   • НЕ доверяем ценам/названиям с клиента — дочитываем из БД по productId.
// Остальные действия — только для авторизованного админа.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { initPayment, getPaymentState, mapPaymentStatus } from "@/lib/tinkoff";
import type { OrderItem } from "@/lib/types";

const MAX_LINES = 50;
const MAX_QTY = 99;
const NAME_MAX = 100;
const PHONE_MAX = 30;
const ADDRESS_MAX = 500;
const COMMENT_MAX = 1000;

const ALLOWED_STATUSES = ["new", "processing", "done", "cancelled"];

export interface CartLineInput {
  productId: string;
  size?: string | null;
  qty: number;
}

export interface CreateOrderInput {
  name: string;
  phone: string;
  address?: string;
  comment?: string;
  items: CartLineInput[];
  // honeypot: настоящие пользователи оставляют пустым
  company?: string;
}

type ActionResult =
  | { success: true; orderId: string; paymentUrl?: string }
  | { error: string };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function createOrderAction(input: CreateOrderInput): Promise<ActionResult> {
  // 1. Корзина должна быть включена
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!settings?.cartEnabled) {
    return { error: "Оформление заказа недоступно" };
  }

  // 2. Анти-спам honeypot
  if (input.company && input.company.trim() !== "") {
    return { error: "Не удалось оформить заказ" };
  }

  // 3. Валидация контактов
  const name = clean(input.name, NAME_MAX);
  const phone = clean(input.phone, PHONE_MAX);
  const address = clean(input.address, ADDRESS_MAX);
  const comment = clean(input.comment, COMMENT_MAX);

  if (name.length < 2) return { error: "Укажите имя" };
  if (phone.replace(/\D/g, "").length < 5) return { error: "Укажите корректный телефон" };

  // 4. Позиции
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { error: "Корзина пуста" };
  }
  const lines = input.items.slice(0, MAX_LINES);

  // Дочитываем актуальные товары из БД — цены и названия берём только отсюда.
  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isAvailable: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const items: OrderItem[] = [];
  let total = 0;
  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) continue; // снят с продажи / не найден — пропускаем
    const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(line.qty) || 1)));
    const size = typeof line.size === "string" && line.size ? line.size.slice(0, 20) : null;
    items.push({ productId: product.id, name: product.name, size, qty, price: product.price });
    total += product.price * qty;
  }

  if (items.length === 0) {
    return { error: "Товары недоступны для заказа" };
  }

  const order = await prisma.order.create({
    data: {
      name,
      phone,
      address: address || null,
      comment: comment || null,
      items: JSON.stringify(items),
      total,
      status: "new",
    },
  });

  revalidatePath("/admin/orders");

  // 5. Онлайн-оплата (если включена): создаём платёж и отдаём ссылку на форму банка.
  // Заказ уже сохранён — при ошибке оплаты не теряем его, покупателю показываем обычное «Заказ принят».
  if (settings.onlinePaymentEnabled) {
    const baseUrl = process.env.APP_BASE_URL;
    if (!baseUrl) {
      console.error("[payment] APP_BASE_URL не задан — оплата пропущена");
      return { success: true, orderId: order.id };
    }
    try {
      const { paymentId, paymentUrl } = await initPayment(
        { id: order.id, phone, items },
        baseUrl,
      );
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId, paymentStatus: "pending" },
      });
      return { success: true, orderId: order.id, paymentUrl };
    } catch (error) {
      console.error("[payment] Init failed:", error);
      return { success: true, orderId: order.id };
    }
  }

  return { success: true, orderId: order.id };
}

// Подтверждение оплаты по возврату с формы банка (страница /cart/success).
// Идемпотентно: спрашивает у Т-Банка статус и при CONFIRMED помечает заказ оплаченным.
export async function confirmOrderPayment(orderId: string): Promise<{ paymentStatus: string }> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { paymentStatus: "none" };
  if (order.paymentStatus === "paid") return { paymentStatus: "paid" };
  if (!order.paymentId) return { paymentStatus: order.paymentStatus };

  try {
    const tinkoffStatus = await getPaymentState(order.paymentId);
    const paymentStatus = mapPaymentStatus(tinkoffStatus);
    if (paymentStatus !== order.paymentStatus) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus,
          paidAt: paymentStatus === "paid" ? new Date() : order.paidAt,
        },
      });
      revalidatePath("/admin/orders");
    }
    return { paymentStatus };
  } catch (error) {
    console.error("[payment] GetState failed:", error);
    return { paymentStatus: order.paymentStatus };
  }
}

// ─── Админские действия ───

export async function updateOrderStatusAction(id: string, status: string) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };
  if (!ALLOWED_STATUSES.includes(status)) return { error: "Неизвестный статус" };
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function deleteOrderAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
}
