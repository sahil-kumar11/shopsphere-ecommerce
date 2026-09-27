import { Link } from "react-router-dom";
import "./CategoryCard.css";

function CategoryCard({ name, image, items }) {
  return (
    <Link to={`/shop?gender=${encodeURIComponent(name)}`} className="category-card">
      <div className="category-image">
        <img src={image} alt={name} />

        <div className="category-overlay">
          <span>{items} items</span>
        </div>
      </div>

      <div className="category-info">
        <h3>{name}</h3>
        <span>Shop Now →</span>
      </div>
    </Link>
  );
}

export default CategoryCard;