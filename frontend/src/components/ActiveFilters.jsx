import { X } from "lucide-react";
import "./ActiveFilters.css";

function ActiveFilters({
  selectedCategories,
  selectedSize,
  selectedColour,
  onRemoveCategory,
  onRemoveSize,
  onRemoveColour,
  onClearAll,
}) {
  const hasFilters =
    (selectedCategories && selectedCategories.length > 0) ||
    selectedSize ||
    selectedColour;

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="active-filters">

      <div className="filter-chips">

        {/* Categories - Multiple */}
        {selectedCategories && selectedCategories.map((category) => (
          <button
            key={category}
            className="filter-chip"
            onClick={() => onRemoveCategory(category)}
          >
            {category}
            <X size={12} />
          </button>
        ))}

        {/* Size */}
        {selectedSize && (
          <button
            className="filter-chip"
            onClick={onRemoveSize}
          >
            Size: {selectedSize}
            <X size={12} />
          </button>
        )}

        {/* Colour */}
        {selectedColour && (
          <button
            className="filter-chip"
            onClick={onRemoveColour}
          >
            {selectedColour}
            <X size={12} />
          </button>
        )}

        {/* Clear All */}
        <button
          className="clear-filters"
          onClick={onClearAll}
        >
          Clear all
        </button>

      </div>

    </div>
  );
}

export default ActiveFilters;