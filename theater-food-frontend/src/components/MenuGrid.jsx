import MenuCard from "./MenuCard";

export default function MenuGrid({
  items,
  cartItems = [],
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
}) {
  const getCartQuantity = (itemId) => {
    const found = cartItems.find((ci) => ci.id === itemId);
    return found ? found.quantity : 0;
  };

  if (!items || items.length === 0) {
    return (
      <div className="menu-grid-empty">
        <p>No items found matching your selection.</p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          cartQuantity={getCartQuantity(item.id)}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
}
