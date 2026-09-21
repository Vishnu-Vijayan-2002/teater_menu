import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onClear, placeholder = "Search popcorn, burgers, drinks..." }) {
  return (
    <div className="search-bar-wrapper">
      <Search size={18} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search-clear-btn" onClick={onClear} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
