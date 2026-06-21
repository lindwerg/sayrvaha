import { getOrders } from "@/lib/data";
import { deleteOrderAction } from "@/app/actions/orders";
import OrderStatusSelect from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-serif mb-6">Заказы</h1>

      {orders.length === 0 ? (
        <p className="text-muted">Заказов пока нет.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium">{order.name}</p>
                  <a
                    href={`tel:${order.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {order.phone}
                  </a>
                  <p className="text-xs text-muted mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusSelect orderId={order._id} status={order.status} />
                  <form action={deleteOrderAction}>
                    <input type="hidden" name="id" value={order._id} />
                    <button
                      type="submit"
                      className="text-xs text-muted hover:text-red-500 transition-colors"
                    >
                      Удалить
                    </button>
                  </form>
                </div>
              </div>

              {order.address && (
                <p className="text-sm text-muted mb-1">
                  <span className="text-foreground">Адрес:</span> {order.address}
                </p>
              )}
              {order.comment && (
                <p className="text-sm text-muted mb-3">
                  <span className="text-foreground">Комментарий:</span> {order.comment}
                </p>
              )}

              <ul className="border-t border-border pt-3 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.name}
                      {item.size ? `, ${item.size}` : ""} × {item.qty}
                    </span>
                    <span className="text-muted">
                      {(item.price * item.qty).toLocaleString("ru-RU")} ₽
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-sm font-medium border-t border-border mt-3 pt-3">
                <span>Итого</span>
                <span>{order.total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
