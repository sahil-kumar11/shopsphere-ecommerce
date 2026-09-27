import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import "./CategorySection.css";

const categories = [
  {
    name: "Women",
    items: 128,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Men",
    items: 96,
    image:
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Accessories",
    items: 74,
    image:
      "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Footwear",
    items: 62,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
];

function CategorySection() {
  return (
    <section className="category-section section">
      <div className="container">

        <div className="section-header">
          <div>
            <p className="section-label">Explore</p>

            <h2 className="section-title">
              Shop by Category
            </h2>
          </div>

          <Link to="/shop" className="section-link">
            View All
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              image={category.image}
              items={category.items}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default CategorySection;