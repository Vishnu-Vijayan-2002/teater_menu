import { Plus } from "lucide-react";
import QuantityControl from "./QuantityControl";
import { formatCurrency } from "../utils/currency";

export default function MenuCard({
  item,
  cartQuantity = 0,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}) {
  return (
    <div className="menu-card">
      <div className="menu-card-image-wrap" onClick={() => onOpenDetails && onOpenDetails(item)}>
        <img src={item.image || "/images/popcorn.svg"} alt={item.name} loading="lazy" />
        {item.isBestseller && <span className="bestseller-badge">★ Bestseller</span>}
      </div>

      <div className="menu-card-body">
        <div className="menu-card-header">
          <span
            className={`diet-indicator ${item.isVeg !== false ? "veg" : "non-veg"}`}
            title={item.isVeg !== false ? "Vegetarian" : "Non-Vegetarian"}
          >
            <span className="diet-dot" />
          </span>
          {item.calories && <span className="calories-tag">{item.calories}</span>}
        </div>

        <h3 className="menu-card-title" onClick={() => onOpenDetails && onOpenDetails(item)}>
          {item.name}
        </h3>

        <p className="menu-card-desc">{item.description}</p>

        <div className="menu-card-footer">
          <div className="menu-card-price">
            <span className="price-amount">{formatCurrency(item.price)}</span>
          </div>

          <div className="menu-card-action">
            {cartQuantity > 0 ? (
              <QuantityControl
                quantity={cartQuantity}
                onIncrement={() => onUpdateQuantity(item.id, cartQuantity + 1)}
                onDecrement={() => onUpdateQuantity(item.id, cartQuantity - 1)}
              />
            ) : (
              <button
                type="button"
                className="add-to-cart-btn"
                onClick={() => onAddToCart(item, 1)}
              >
                ADD <Plus size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
