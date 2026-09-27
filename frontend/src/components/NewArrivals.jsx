import { Link } from "react-router-dom";
import { newArrivals } from "../data/products";
import ProductCard from "./ProductCard";
import "./NewArrivals.css";

function NewArrivals() {
  return (
    <section className="new-arrivals section">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="section-label">Just dropped</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link to="/shop?sort=newest" className="section-link">View All</Link>
        </div>
        <div className="product-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;