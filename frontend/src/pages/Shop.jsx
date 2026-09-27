import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ShopHeader from "../components/ShopHeader";
import FilterSidebar from "../components/FilterSidebar";
import ShopToolbar from "../components/ShopToolbar";
import ActiveFilters from "../components/ActiveFilters";
import ShopProductGrid from "../components/ShopProductGrid";
import Pagination from "../components/Pagination";

import { products } from "../data/products";

import "./Shop.css";

function Shop() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState("popular");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // URL PARAMETERS
  // =========================

  const search =
    searchParams.get("search")?.toLowerCase().trim() || "";

  const queryGender = searchParams.get("gender") || "";
  const querySort = searchParams.get("sort");
  const queryFilter = searchParams.get("filter");

  const isSalePage = queryFilter === "sale";
  const isNewArrivalsPage = querySort === "newest";

  // =========================
  // URL STATE
  // =========================

  useEffect(() => {
    if (querySort === "newest") {
      setSortOption("newest");
    } else {
      setSortOption("popular");
    }

    setCurrentPage(1);
  }, [querySort, queryGender, queryFilter, search]);

  // =========================
  // CATEGORY FILTER - Multiple selection
  // =========================

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setCurrentPage(1);

    // If currently on Sale or New Arrivals,
    // return to normal Shop page.
    if (isSalePage || isNewArrivalsPage) {
      navigate("/shop");
    }
  };

  // =========================
  // SORT PRODUCTS
  // =========================

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "name":
        return a.name.localeCompare(b.name);

      case "newest":
        return b.id - a.id;

      default:
        return a.id - b.id;
    }
  });

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = sortedProducts.filter((product) => {
    // Category - Check if product category matches any selected category
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    // Gender
    const genderMatch =
      !queryGender ||
      product.gender === queryGender;

    // Sale
    // A product is considered on sale
    // when it has an oldPrice greater than its current price.
    const saleMatch =
      !isSalePage ||
      (
        product.oldPrice &&
        product.price < product.oldPrice
      );

    // Search
    const searchMatch =
      !search ||
      `${product.name} ${product.category} ${product.gender}`
        .toLowerCase()
        .includes(search);

    return (
      categoryMatch &&
      genderMatch &&
      saleMatch &&
      searchMatch
    );
  });

  // =========================
  // PAGINATION
  // =========================

  const productsPerPage = 6;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / productsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  // =========================
  // RENDER
  // =========================

  return (
    <>
      <Navbar />
      <main className="shop-page">
        <div className="container">

          <ShopHeader />

          <div className="shop-layout">

            {/* =========================
                FILTER SIDEBAR
            ========================= */}

            <aside className="shop-sidebar">
              <FilterSidebar
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </aside>

            {/* =========================
                PRODUCTS AREA
            ========================= */}

            <section className="shop-products">

              <ActiveFilters
                selectedCategories={selectedCategories}
                onRemoveCategory={(category) => {
                  setSelectedCategories(
                    selectedCategories.filter((c) => c !== category)
                  );
                  setCurrentPage(1);
                }}
                onClearAll={clearAllFilters}
              />

              {/* =========================
                  SALE / NEW ARRIVAL TITLE
              ========================= */}

              {isSalePage && (
                <div className="shop-filter-heading">
                  <h2>Sale</h2>
                  <p>
                    Up to amazing discounts on
                    selected products.
                  </p>
                </div>
              )}

              {isNewArrivalsPage && (
                <div className="shop-filter-heading">
                  <h2>New Arrivals</h2>
                  <p>
                    Discover our latest products.
                  </p>
                </div>
              )}

              <ShopToolbar
                productCount={filteredProducts.length}
                visibleCount={currentProducts.length}
                onSortChange={(value) => {
                  setSortOption(value);
                  setCurrentPage(1);
                }}
              />

              {/* =========================
                  PRODUCT GRID
              ========================= */}

              {currentProducts.length > 0 ? (
                <ShopProductGrid products={currentProducts} />
              ) : (
                <div className="shop-empty-state">
                  <h2>No products found</h2>
                  <p>Try changing your filters or search.</p>
                  <button className="btn btn-outline" onClick={clearAllFilters}>
                    Clear Filters
                  </button>
                </div>
              )}

              {/* =========================
                  PAGINATION
              ========================= */}

              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Shop;