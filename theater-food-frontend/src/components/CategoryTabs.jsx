export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="category-tabs-container">
      <div className="category-tabs-scroll">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-tab-pill ${isActive ? "active" : ""}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
