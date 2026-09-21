import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import MenuGrid from "../components/MenuGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import FoodDetailsModal from "../components/FoodDetailsModal";
import DesktopCart from "../components/DesktopCart";
import MobileCartBar from "../components/MobileCartBar";
import { fetchMenuItems } from "../services/menuService";
import { mockCategories } from "../data/mockMenu";
import { useCart } from "../context/CartContext";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);

  const { cartItems, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const items = await fetchMenuItems();
        if (mounted) {
          setMenuItems(items);
        }
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat =
        selectedCategory === "all" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const selectedModalCartQty = useMemo(() => {
    if (!selectedItemForModal) return 0;
    const found = cartItems.find((ci) => ci.id === selectedItemForModal.id);
    return found ? found.quantity : 0;
  }, [selectedItemForModal, cartItems]);

  return (
    <div className="customer-page-layout">
      <Header />

      <main className="customer-menu-main">
        <div className="customer-menu-container">
          {/* Left / Main Content: Search, Filter, Grid */}
          <div className="customer-catalog-section">
            {/* Search & Filter Header */}
            <div className="menu-controls-header">
              <div className="menu-hero-intro">
                <h1>Gourmet Concessions</h1>
                <p>Delivered fresh and hot straight to your theater seat during the show.</p>
              </div>

              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
              />

              <CategoryTabs
                categories={mockCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Menu Grid */}
            {loading ? (
              <LoadingSkeleton count={6} />
            ) : (
              <MenuGrid
                items={filteredItems}
                cartItems={cartItems}
                onAddToCart={addToCart}
                onUpdateQuantity={updateQuantity}
                onOpenDetails={setSelectedItemForModal}
              />
            )}
          </div>

          {/* Desktop Right Sidebar Cart */}
          <DesktopCart />
        </div>
      </main>

      {/* Floating Mobile Cart Bar */}
      <MobileCartBar />

      {/* Item Details Modal */}
      {selectedItemForModal && (
        <FoodDetailsModal
          item={selectedItemForModal}
          cartQuantity={selectedModalCartQty}
          onClose={() => setSelectedItemForModal(null)}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </div>
  );
}
