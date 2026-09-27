import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const saved = isInWishlist(product.id);

  const handleQuickAdd = async () => {
    // FIX: Send null for size and colour to bypass Django validation
    const size = null;
    const colour = null;

    console.log("🚀 SENDING TO API:", {
      product_id: product.id,
      quantity: 1,
      selected_size: size,
      selected_colour: colour
    });

    try {
      // 1. Add to cart (wait for backend + context update)
      await addToCart(product, 1, size, colour);
      
      // 2. ⚠️ FIX: Give React state a tiny moment to catch up
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 3. Show toast and update UI
      showToast(`${product.name} added to cart`, "success");
    } catch (error) {
      console.error("❌ Cart API Error:", error);
      showToast(error.message || "Could not add item to cart. Please try again.", "error");
    }
  };

  const handleWishlistToggle = async () => {
    const wasSaved = isInWishlist(product.id);
    
    try {
      // 1. Toggle wishlist (wait for backend + context update)
      await toggleWishlist(product);
      
      // 2. ⚠️ FIX: Give React state a tiny moment to catch up
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 3. Show toast based on the PREVIOUS state (wasSaved)
      showToast(
        wasSaved 
          ? `${product.name} removed from wishlist` 
          : `${product.name} added to wishlist`,
        wasSaved ? "error" : "success"
      );
    } catch (error) {
      console.error("❌ Wishlist API Error:", error);
      showToast(error.message || "Please login to use wishlist", "error");
    }
  };

  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img 
            src={
              product.image && product.image.trim() !== "" 
                ? product.image 
                : "https://via.placeholder.com/400x500?text=No+Image"
            } 
            alt={product.name} 
          />
        </Link>

        {product.badge && <span className="product-badge">{product.badge}</span>}

        <button
          className={`wishlist-button ${saved ? "active" : ""}`}
          onClick={handleWishlistToggle}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          type="button"
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
        </button>

        <button className="quick-add" onClick={handleQuickAdd} type="button">
          <ShoppingBag size={14} />
          Quick Add
        </button>
      </div>

      <Link to={`/product/${product.id}`} className="product-info">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-price">
          <span>₨{product.price.toLocaleString()}</span>
          {product.oldPrice && <del>₨{product.oldPrice.toLocaleString()}</del>}
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;