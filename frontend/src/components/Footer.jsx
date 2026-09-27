import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>
            shop<span>•</span>sphere
          </h2>

          <p>
            Considered essentials from independent makers.
            Based in Karachi, shipping worldwide.
          </p>
        </div>

        {/* Shop */}
        <div className="footer-column">
          <h3>SHOP</h3>

          <Link to="/shop?sort=newest">
            New Arrivals
          </Link>

          <Link to="/shop?gender=Women">
            Women
          </Link>

          <Link to="/shop?gender=Men">
            Men
          </Link>

          <Link to="/shop?filter=sale">
            Sale
          </Link>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3>SUPPORT</h3>

          <Link to="/track-order">
            Track Order
          </Link>

          <Link to="/returns">
            Returns
          </Link>

          <Link to="/shipping">
            Shipping Info
          </Link>

          <Link to="/contact">
            Contact
          </Link>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h3>COMPANY</h3>

          <Link to="/about">
            About
          </Link>

          <Link to="/sustainability">
            Sustainability
          </Link>

          <Link to="/careers">
            Careers
          </Link>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          © 2026 ShopSphere. All rights reserved.
        </p>

        <div>
          <Link to="/privacy">
            Privacy
          </Link>

          <span> • </span>

          <Link to="/terms">
            Terms
          </Link>
        </div>

      </div>

    </footer>
  );
}

export default Footer;