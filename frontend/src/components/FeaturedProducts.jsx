import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  // Show only 6 curated products on the homepage
  const featuredProducts = products.filter((product) =>
    [1, 3, 4, 8, 9, 21].includes(product.id)
  );

  return (
    <section className="featured-products section">
      <div className="container">

        <div className="section-header">
          <div>
            <p className="section-label">
              Handpicked for you
            </p>

            <h2 className="section-title">
              Featured Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="section-link"
          >
            Shop All
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;