import { Minus, Plus, Trash2 } from "lucide-react";

export default function QuantityControl({ quantity, onIncrement, onDecrement, size = "md" }) {
  const isSm = size === "sm";

  return (
    <div className={`quantity-control ${isSm ? "quantity-control-sm" : ""}`}>
      <button
        type="button"
        className="qty-btn"
        onClick={onDecrement}
        aria-label="Decrease quantity"
      >
        {quantity === 1 ? <Trash2 size={isSm ? 13 : 15} /> : <Minus size={isSm ? 13 : 15} />}
      </button>
      <span className="qty-value">{quantity}</span>
      <button
        type="button"
        className="qty-btn"
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <Plus size={isSm ? 13 : 15} />
      </button>
    </div>
  );
}
