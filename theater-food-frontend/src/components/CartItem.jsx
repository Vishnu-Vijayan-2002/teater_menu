import QuantityControl from "./QuantityControl";
import { formatCurrency } from "../utils/currency";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

  return (
    <div className="cart-item-row">
      <div className="cart-item-img-wrap">
        <img src={item.image || "/images/popcorn.svg"} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <span className={`diet-indicator ${item.isVeg !== false ? "veg" : "non-veg"}`}>
            <span className="diet-dot" />
          </span>
          <h4 className="cart-item-name">{item.name}</h4>
        </div>
        <div className="cart-item-price-unit">{formatCurrency(item.price)} each</div>
      </div>

      <div className="cart-item-actions">
        <QuantityControl
          size="sm"
          quantity={item.quantity}
          onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
        />
        <span className="cart-item-total-price">{formatCurrency(itemTotal)}</span>
      </div>
    </div>
  );
}
