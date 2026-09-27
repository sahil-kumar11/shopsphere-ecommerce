import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { products } from "../data/products";
import "./FilterSidebar.css";

function FilterSidebar({
  selectedCategories,
  onCategoryChange,
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  // Get all unique categories with counts
  const categories = [
    ...new Set(
      products.map((product) => product.category)
    ),
  ].map((name) => ({
    name,
    count: products.filter(
      (product) => product.category === name
    ).length,
  }));

  const handleCategoryToggle = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      onCategoryChange(
        selectedCategories.filter((c) => c !== categoryName)
      );
    } else {
      onCategoryChange([...selectedCategories, categoryName]);
    }
  };

  return (
    <aside className="filter-sidebar">

      {/* CATEGORY */}
      <div className="filter-section">

        <button
          className="filter-section-header"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          type="button"
        >
          <span>Category</span>
          {isCategoryOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {isCategoryOpen && (
          <div className="filter-options">

            {categories.map((category) => (
              <label
                className="checkbox-option"
                key={category.name}
              >

                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryToggle(category.name)}
                />

                <span className="custom-checkbox"></span>

                <span className="option-name">
                  {category.name}
                </span>

                <span className="option-count">
                  {category.count}
                </span>

              </label>
            ))}

          </div>
        )}

      </div>

    </aside>
  );
}

export default FilterSidebar;