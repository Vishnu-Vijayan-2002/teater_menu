import { X, Plus } from "lucide-react";
import QuantityControl from "./QuantityControl";
import { formatCurrency } from "../utils/currency";

export default function FoodDetailsModal({
  item,
  cartQuantity = 0,
  onClose,
  onAddToCart,
  onUpdateQuantity,
}) {
  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="food-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="food-modal-image-wrap">
          <img src={item.image || "/images/popcorn.svg"} alt={item.name} />
          {item.isBestseller && <span className="bestseller-badge">★ Bestseller</span>}
        </div>

        <div className="food-modal-body">
          <div className="food-modal-meta">
            <span
              className={`diet-indicator ${item.isVeg !== false ? "veg" : "non-veg"}`}
              title={item.isVeg !== false ? "Vegetarian" : "Non-Vegetarian"}
            >
              <span className="diet-dot" />
            </span>
            <span className="food-modal-category">{item.category}</span>
            {item.calories && <span className="calories-tag">{item.calories}</span>}
          </div>

          <h2 className="food-modal-title">{item.name}</h2>
          <p className="food-modal-desc">{item.description}</p>

          <div className="food-modal-footer">
            <div className="food-modal-price">
              <span className="price-label">Price</span>
              <span className="price-value">{formatCurrency(item.price)}</span>
            </div>

            <div className="food-modal-action">
              {cartQuantity > 0 ? (
                <QuantityControl
                  quantity={cartQuantity}
                  onIncrement={() => onUpdateQuantity(item.id, cartQuantity + 1)}
                  onDecrement={() => onUpdateQuantity(item.id, cartQuantity - 1)}
                />
              ) : (
                <button
                  type="button"
                  className="primary-btn add-btn-large"
                  onClick={() => onAddToCart(item, 1)}
                >
                  ADD TO TRAY <Plus size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
