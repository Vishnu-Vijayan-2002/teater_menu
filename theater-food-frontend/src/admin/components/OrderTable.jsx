import {
  MoreVertical,
  Eye,
} from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderTable({
  orders,
  onStatusChange,
  onViewOrder,
}) {
  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Seat</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Time</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <div className="order-id">
                  <strong>{order.id}</strong>
                  <span>{order.type || "Food Order"}</span>
                </div>
              </td>

              <td>
                <div className="customer-cell">
                  <strong>{order.customerName}</strong>
                  <span>{order.phone}</span>
                </div>
              </td>

              <td>
                <span className="seat-badge">
                  {order.seat}
                </span>
              </td>

              <td>
                <span className="items-count">
                  {order.items.length} items
                </span>
              </td>

              <td>
                <strong>
                  ₹{order.total.toLocaleString("en-IN")}
                </strong>
              </td>

              <td>
                <OrderStatusBadge status={order.status} />
              </td>

              <td>
                <span className="order-time">
                  {order.time}
                </span>
              </td>

              <td>
                <button
                  className="table-action"
                  onClick={() =>
                    onViewOrder(order)
                  }
                  title="View order"
                >
                  <Eye size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="empty-table">
          <p>No orders found.</p>
        </div>
      )}
    </div>
  );
}