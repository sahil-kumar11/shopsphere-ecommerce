import { ChevronDown } from "lucide-react";
import "./ShopToolbar.css";

function ShopToolbar({
  productCount,
  visibleCount,
  onSortChange,
}) {
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="shop-toolbar">

      {/* Results Count */}
      <p className="results-count">
        Showing{" "}
        <strong>
          {visibleCount ?? productCount}
        </strong>{" "}
        of{" "}
        <strong>
          {productCount}
        </strong>{" "}
        results
      </p>

      {/* Sort */}
      <div className="toolbar-actions">

        <div className="sort-control">

          <label htmlFor="sort">
            Sort:
          </label>

          <div className="sort-select">

            <select
              id="sort"
              onChange={handleSortChange}
              defaultValue="popular"
            >
              <option value="popular">
                Popularity
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name">
                Name: A–Z
              </option>

              <option value="newest">
                Newest
              </option>
            </select>

            <ChevronDown size={14} />

          </div>

        </div>

      </div>

    </div>
  );
}

export default ShopToolbar;