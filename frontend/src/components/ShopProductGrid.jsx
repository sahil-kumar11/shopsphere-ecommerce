import {
  Heart,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useWishlist,
} from "../context/WishlistContext";

import { useToast } from "../context/ToastContext"; // ← ADD THIS

import "./ShopProductGrid.css";

function ShopProductGrid({ products }) {
  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const { showToast } = useToast(); // ← ADD THIS

  return (
    <div className="shop-product-grid">

      {products.map((product) => {

        const saved =
          isInWishlist(product.id);

        return (
          <div
            key={product.id}
            className="shop-product-card"
          >

            <div className="shop-product-image">

              <Link
                to={`/product/${product.id}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                />
              </Link>

              {product.badge && (
                <span className="product-badge">
                  {product.badge}
                </span>
              )}

              <button
                className={`product-wishlist-button ${
                  saved ? "active" : ""
                }`}
                onClick={() => {
                  toggleWishlist(product);
                  // ← ADD THIS
                  if (!saved) {
                    showToast(
                      `<strong>${product.name}</strong> added to wishlist`,
                      "success"
                    );
                  } else {
                    showToast(
                      `<strong>${product.name}</strong> removed from wishlist`,
                      "error"
                    );
                  }
                }}
                aria-label={
                  saved
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={17}
                  fill={
                    saved
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

            </div>

            <Link
              to={`/product/${product.id}`}
              className="shop-product-info"
            >

              <p className="shop-product-category">
                {product.category}
              </p>

              <h3 className="shop-product-name">
                {product.name}
              </h3>

              <div className="shop-product-price">

                <span className="shop-current-price">
                  ₨
                  {product.price.toLocaleString()}
                </span>

                {product.oldPrice && (
                  <span className="shop-old-price">
                    ₨
                    {product.oldPrice.toLocaleString()}
                  </span>
                )}

              </div>

            </Link>

          </div>
        );
      })}

    </div>
  );
}

export default ShopProductGrid;