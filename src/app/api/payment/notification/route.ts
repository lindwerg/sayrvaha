// Вебхук Т-Банка (server-to-server). Банк присылает статус платежа сюда.
// Проверяем подпись Token, обновляем paymentStatus заказа, отвечаем телом "OK".
// На localhost не вызывается (банк не достучится) — там статус подтверждаем через GetState
// на странице /cart/success. На проде это основной надёжный путь.

import { prisma } from "@/lib/db";
import { verifyNotificationToken, mapPaymentStatus } from "@/lib/tinkoff";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response("ERROR", { status: 400 });
  }

  if (!verifyNotificationToken(body)) {
    console.error("[payment] notification: неверная подпись Token");
    return new Response("ERROR", { status: 403 });
  }

  const orderId = typeof body.OrderId === "string" ? body.OrderId : String(body.OrderId ?? "");
  const status = typeof body.Status === "string" ? body.Status : "";
  if (!orderId || !status) {
    return new Response("OK", { status: 200 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (order) {
    const paymentStatus = mapPaymentStatus(status);
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        paidAt: paymentStatus === "paid" ? order.paidAt ?? new Date() : order.paidAt,
      },
    });
  }

  // Т-Банк ждёт ответ "OK", иначе будет повторять уведомление.
  return new Response("OK", { status: 200 });
}
