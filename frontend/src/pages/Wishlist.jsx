import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import "./Wishlist.css";

function Wishlist() {
  const { wishlistItems, loading, error, removeFromWishlist, addWishlistItemToCart, addAllToCart } = useWishlist();
  const { showToast } = useToast();

  const handleAddToCart = async (product) => {
    try {
      await addWishlistItemToCart(product);
      showToast(`${product.name} added to cart`, "success");
    } catch (err) {
      showToast(err.message || "Could not add item to cart", "error");
    }
  };

  const handleAddAllToCart = async () => {
    try {
      await addAllToCart();
      showToast(`All ${wishlistItems.length} items added to cart`, "success");
    } catch (err) {
      showToast(err.message || "Could not add all items to cart", "error");
    }
  };

  const handleRemove = async (product) => {
    try {
      await removeFromWishlist(product.id);
      showToast(`${product.name} removed from wishlist`, "error");
    } catch (err) {
      showToast(err.message || "Could not remove item", "error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="wishlist-page">
        <div className="container">
          <div className="wishlist-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Wishlist</span></div>
          <div className="wishlist-header">
            <div><h1 className="wishlist-title">Your Wishlist</h1><p className="wishlist-count">{wishlistItems.length} saved {wishlistItems.length === 1 ? "item" : "items"}</p></div>
            {wishlistItems.length > 0 && <button type="button" className="add-all-button" onClick={handleAddAllToCart}>ADD ALL TO CART</button>}
          </div>
          {loading ? <div className="wishlist-empty"><Heart size={42} /><h2>Loading your wishlist...</h2></div> : error ? <div className="wishlist-empty"><Heart size={42} /><h2>Unable to load wishlist</h2><p>{error}</p></div> : wishlistItems.length === 0 ? (
            <div className="wishlist-empty"><Heart size={42} strokeWidth={1.2} /><h2>Your wishlist is empty</h2><p>Save products you love and find them here later.</p><Link to="/shop" className="wishlist-shop-button">CONTINUE SHOPPING</Link></div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map((product) => {
                // Calculate discount percentage
                const oldPrice = Number(product.oldPrice || 0);
                const currentPrice = Number(product.price || 0);
                const discount = oldPrice > currentPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

                // ✅ Smart Badge Detection
                // 1. Check if product is 'New' (ID based detection for demo purposes)
                const isNew = [2, 11, 14, 15, 17, 19, 24].includes(product.id);
                
                // 2. Check if product is on 'Sale'
                const isSale = product.badge === "Sale" || discount > 0;

                // 3. Check if product should show 'Only a few left' (ID based detection)
                const showStockWarning = [1, 3, 8, 13].includes(product.id);

                return (
                  <article key={product.id} className="wishlist-card">
                    <div className="wishlist-image">
                      <Link to={`/product/${product.id}`}>
                        <img 
                          src={
                            product.image && product.image.trim() !== "" 
                              ? product.image 
                              : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                          } 
                          alt={product.name} 
                        />
                      </Link>

                      {/* ✅ Badge for SALE or NEW */}
                      {isSale && <span className="wishlist-badge" style={{ backgroundColor: "#ff5845" }}>SALE</span>}
                      {isNew && <span className="wishlist-badge" style={{ backgroundColor: "#71834f" }}>NEW</span>}

                      {/* ✅ 'Only a few left' indicator - only shows for specific products */}
                      {showStockWarning && (
                        <div className="stock-indicator" style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          left: '10px', 
                          background: 'rgba(255,255,255,0.9)', 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '9px', 
                          fontWeight: '600', 
                          color: '#d45a4a',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          • Only a few left
                        </div>
                      )}

                      <button type="button" className="wishlist-remove" onClick={() => handleRemove(product)} aria-label={`Remove ${product.name}`}><span>×</span></button>
                    </div>

                    <div className="wishlist-info">
                      <p className="wishlist-category">{product.category}</p>
                      <Link to={`/product/${product.id}`}><h3>{product.name}</h3></Link>

                      {/* ✅ Price with Old Price Strike-through */}
                      <div className="wishlist-price">
                        <span className="wishlist-current-price">₨{currentPrice.toLocaleString()}</span>
                        {oldPrice > currentPrice && (
                          <span className="wishlist-old-price">₨{oldPrice.toLocaleString()}</span>
                        )}
                      </div>

                      <button type="button" className="wishlist-add-cart" onClick={() => handleAddToCart(product)}>
                        ADD TO CART
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Wishlist;