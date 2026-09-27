import { useState } from "react";
import {
  Moon,
  Heart,
  ShoppingBag,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";

import "./Navbar.css";

function Navbar() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlistItems.length;

  // =========================
  // CURRENT URL
  // =========================

  const params = new URLSearchParams(location.search);

  const sort = params.get("sort");
  const filter = params.get("filter");
  const gender = params.get("gender");
  const searchQuery = params.get("search");

  // =========================
  // ACTIVE MAIN NAV
  // =========================

  const isHome =
    location.pathname === "/" &&
    !searchQuery;

  const isShop =
    location.pathname === "/shop" &&
    !sort &&
    !filter &&
    !gender &&
    !searchQuery;

  const isNewArrivals =
    location.pathname === "/shop" &&
    sort === "newest";

  const isSale =
    location.pathname === "/shop" &&
    filter === "sale";

  // =========================
  // ACTIVE CATEGORY NAV
  // =========================

  const isWomen =
    location.pathname === "/shop" &&
    gender === "Women";

  const isMen =
    location.pathname === "/shop" &&
    gender === "Men";

  const isAccessories =
    location.pathname === "/shop" &&
    gender === "Accessories";

  const isFootwear =
    location.pathname === "/shop" &&
    gender === "Footwear";

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(
        `/shop?search=${encodeURIComponent(query)}`
      );
      setSearch("");
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* =========================
          ANNOUNCEMENT BAR
      ========================= */}

      <div className="announcement-bar">
        <span>
          Free shipping on orders over ₨5,000
        </span>

        <div className="announcement-right">
          <span>EN</span>
          <span>•</span>
          <span>₨ PKR</span>
          <span>•</span>
          <span>Track Order</span>
        </div>
      </div>

      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <header className="navbar">
        <div className="navbar-container">

          {/* Logo */}

          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
          >
            shop<span>•</span>sphere
          </Link>

          {/* Main Navigation */}

          <nav className="main-nav">

            <Link
              to="/"
              className={isHome ? "active" : ""}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={isShop ? "active" : ""}
            >
              Shop
            </Link>

            <Link
              to="/shop?sort=newest"
              className={isNewArrivals ? "active" : ""}
            >
              New Arrivals
            </Link>

            <Link
              to="/shop?filter=sale"
              className={isSale ? "active" : ""}
            >
              Sale
            </Link>

          </nav>

          {/* Search */}

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <Search size={14} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              type="search"
              placeholder="Search for products, brands..."
              aria-label="Search products"
            />
          </form>

          {/* Actions */}

          <div className="nav-actions">

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              <Moon size={16} />
            </button>

            <Link
  to="/auth"
  className="nav-icon-link"
  aria-label="Account"
>
  <User size={16} />
</Link>
            <Link
              to="/wishlist"
              className="nav-icon-link icon-badge"
              aria-label="Wishlist"
            >
              <Heart
                size={16}
                fill={
                  wishlistCount > 0
                    ? "currentColor"
                    : "none"
                }
              />

              {wishlistCount > 0 && (
                <span className="badge-count">{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/cart"
              className="nav-icon-link icon-badge"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={16} />

              {cartCount > 0 && (
                <span className="badge-count">{cartCount}</span>
              )}
            </Link>

            <button
              type="button"
              className="menu-button"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              onClick={() =>
                setMenuOpen((open) => !open)
              }
            >
              {menuOpen ? (
                <X size={17} />
              ) : (
                <Menu size={17} />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}

        {menuOpen && (
          <nav className="mobile-menu">

            <Link
              to="/"
              className={isHome ? "active" : ""}
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={isShop ? "active" : ""}
              onClick={closeMenu}
            >
              Shop
            </Link>

            <Link
              to="/shop?sort=newest"
              className={isNewArrivals ? "active" : ""}
              onClick={closeMenu}
            >
              New Arrivals
            </Link>

            <Link
              to="/shop?filter=sale"
              className={isSale ? "active" : ""}
              onClick={closeMenu}
            >
              Sale
            </Link>

            <Link
              to="/wishlist"
              onClick={closeMenu}
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              onClick={closeMenu}
            >
              Cart
            </Link>

            <Link
              to="/orders"
              onClick={closeMenu}
            >
              Order History
            </Link>

            <Link
              to="/account"
              onClick={closeMenu}
            >
              Account
            </Link>

          </nav>
        )}
      </header>

      {/* =========================
          CATEGORY NAVIGATION
      ========================= */}

      <div className="category-nav">
        <div className="category-container">

          <Link
            to="/shop?gender=Women"
            className={isWomen ? "active" : ""}
          >
            Women
          </Link>

          <Link
            to="/shop?gender=Men"
            className={isMen ? "active" : ""}
          >
            Men
          </Link>

          <Link
            to="/shop?gender=Accessories"
            className={isAccessories ? "active" : ""}
          >
            Accessories
          </Link>

          <Link
            to="/shop?gender=Footwear"
            className={isFootwear ? "active" : ""}
          >
            Footwear
          </Link>

        </div>
      </div>
    </>
  );
}

export default Navbar;