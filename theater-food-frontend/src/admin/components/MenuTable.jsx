import {
  Edit3,
  Trash2,
  Plus,
} from "lucide-react";

export default function MenuTable({
  items,
  onEdit,
  onDelete,
  onAdd,
}) {
  return (
    <div className="menu-management">
      <div className="menu-table-header">
        <div>
          <h2>Menu Items</h2>
          <p>
            Manage food, beverages and pricing.
          </p>
        </div>

        <button
          className="primary-admin-button"
          onClick={onAdd}
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="menu-table-wrapper">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="menu-item-cell">
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="category-badge">
                    {item.category}
                  </span>
                </td>

                <td>
                  <strong>₹{item.price}</strong>
                </td>

                <td>
                  <span
                    className={
                      item.stock > 10
                        ? "stock-good"
                        : "stock-low"
                    }
                  >
                    {item.stock}
                  </span>
                </td>

                <td>
                  <span
                    className={`menu-status ${
                      item.available
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    {item.available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </td>

                <td>
                  <div className="menu-actions">
                    <button
                      onClick={() =>
                        onEdit(item)
                      }
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      className="delete-action"
                      onClick={() =>
                        onDelete(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}