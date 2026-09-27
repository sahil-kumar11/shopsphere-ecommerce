import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        <p className="hero-label">
          THE NEW SEASON EDIT
        </p>

        <h1>
          Curated style.
          <br />
          <span>Made for you.</span>
        </h1>

        <p className="hero-description">
          Discover considered essentials from independent
          brands and makers around the world.
        </p>

        <div className="hero-buttons">
          <Link to="/shop" className="btn btn-primary">
            Shop Collection
          </Link>

          <Link to="/shop" className="btn btn-outline">
            Explore New Arrivals
          </Link>
        </div>

      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80"
          alt="Fashion collection"
        />

        <div className="hero-image-label">
          <span>01</span>
          <p>Spring / Summer 2026</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;