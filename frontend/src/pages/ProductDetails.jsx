import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { getProduct } from "../services/api";
import { products } from "../data/products";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

import "./ProductDetails.css";


function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [activeImage, setActiveImage] = useState(0);

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();


  /*
   * ============================================================
   * FETCH PRODUCT
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setProduct(null);

        let data = await getProduct(id);

        if (!mounted) {
          return;
        }

        // Merge with fallback data if backend returns empty arrays
        const fallback = products.find(p => String(p.id) === String(id));
        
        if (fallback) {
          data = {
            ...data,
            sizes: (data.sizes && data.sizes.length > 0) ? data.sizes : (fallback.sizes || []),
            colours: (data.colours && data.colours.length > 0) ? data.colours : (fallback.colours || []),
            oldPrice: (data.oldPrice || data.old_price || fallback.oldPrice || null),
          };
        }

        setProduct(data);

        // Default first selection
        setSelectedSize(data?.sizes?.[0] || "");
        setSelectedColour(data?.colours?.[0] || "");

        setActiveImage(0);
        setQuantity(1);

      } catch (err) {
        console.error("Failed to fetch product:", err);

        if (mounted) {
          setProduct(null);

          showToast(
            err?.message || "Failed to load product details",
            "error"
          );
        }

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id, showToast]);


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="product-details-page">
          <div className="container">
            <div className="product-loading">
              <h1>Loading product...</h1>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }


  /*
   * ============================================================
   * PRODUCT NOT FOUND
   * ============================================================
   */

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="product-details-page">
          <div className="container">
            <h1>Product Not Found</h1>

            <p>
              Sorry, this product does not exist.
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }


  /*
   * ============================================================
   * PRODUCT IMAGE
   * ============================================================
   */

  const productImage =
    typeof product.image === "string" &&
    product.image.trim() !== ""
      ? product.image.trim()
      : null;

  const images = productImage
    ? [productImage]
    : [];


  const previousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };


  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };


  /*
   * ============================================================
   * COLOUR MAP
   * ============================================================
   */

  const colourValues = {
    Black: "#17182c",
    White: "#f5f5f2",
    Brown: "#92724d",
    Cream: "#e8dfcf",
    Blue: "#315b8a",
    Red: "#b83a3a",
    Olive: "#6b705c",
    Grey: "#808080",
    Navy: "#1f2a44",
    Tan: "#c19a6b",
    Beige: "#d8c3a5",
    Yellow: "#e5c453",
  };


  /*
   * ============================================================
   * ADD TO CART (With Size & Colour Validation)
   * ============================================================
   */

  const handleAddToCart = async () => {
    // 1. Validate Size
    const backendSizes = Array.isArray(product.sizes) ? product.sizes : [];
    if (selectedSize && !backendSizes.includes(selectedSize)) {
      showToast(`Size "${selectedSize}" is not available for this product in the database.`, "error");
      return;
    }

    // 2. Validate Colour
    const backendColours = Array.isArray(product.colours) ? product.colours : [];
    if (selectedColour && !backendColours.includes(selectedColour)) {
      showToast(`Colour "${selectedColour}" is not available for this product in the database.`, "error");
      return;
    }

    try {
      await addToCart(
        product,
        quantity,
        selectedSize,
        selectedColour
      );

      showToast(
        `${product.name} added to cart`,
        "success"
      );

    } catch (err) {
      console.error(
        "Failed to add product to cart:",
        err
      );

      showToast(
        err?.message ||
          "Failed to add product to cart",
        "error"
      );
    }
  };


  /*
   * ============================================================
   * BUY NOW
   * ============================================================
   */

  const handleBuyNow = async () => {
    try {
      await addToCart(
        product,
        quantity,
        selectedSize,
        selectedColour
      );

      navigate("/checkout");

    } catch (err) {
      console.error(
        "Failed to add product to cart:",
        err
      );

      showToast(
        err?.message ||
          "Failed to proceed to checkout",
        "error"
      );
    }
  };


  /*
   * ============================================================
   * WISHLIST
   * ============================================================
   */

  const handleWishlistToggle = async () => {
    const saved = isInWishlist(product.id);

    try {
      await toggleWishlist(product);

      showToast(
        saved
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`,
        saved ? "error" : "success"
      );

    } catch (err) {
      console.error(
        "Wishlist operation failed:",
        err
      );

      showToast(
        err?.message ||
          "Please login to manage your wishlist",
        "error"
      );
    }
  };


  const saved = isInWishlist(product.id);


  /*
   * ============================================================
   * PRICE & DISCOUNT
   * ============================================================
   */

  const currentPrice = Number(product.price || 0);

  const oldPriceValue = product.oldPrice || product.old_price;
  
  const oldPrice =
    oldPriceValue !== null &&
    oldPriceValue !== undefined &&
    oldPriceValue !== ""
      ? Number(oldPriceValue)
      : null;


  const discount =
    oldPrice && oldPrice > currentPrice
      ? Math.round(
          ((oldPrice - currentPrice) /
            oldPrice) *
            100
        )
      : 0;


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <Navbar />

      <main className="product-details-page">
        <div className="container">

          <div className="product-details">

            {/* ==================================================
                GALLERY
            ================================================== */}

            <div className="product-gallery">

              <div className="product-main-image">

                {images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={`${product.name} view ${
                      activeImage + 1
                    }`}
                  />
                ) : (
                  <div className="product-image-placeholder">
                    <div className="placeholder-content">
                      <span style={{ fontSize: "48px", display: "block", marginBottom: "10px" }}>🖼️</span>
                      <span>No Image Available</span>
                    </div>
                  </div>
                )}


                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="gallery-arrow gallery-arrow-left"
                      onClick={previousImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      className="gallery-arrow gallery-arrow-right"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

              </div>


              {images.length > 1 && (
                <div className="product-thumbnails">

                  {images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`product-thumbnail ${
                        activeImage === index
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setActiveImage(index)
                      }
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${
                          index + 1
                        }`}
                      />
                    </button>
                  ))}

                </div>
              )}

            </div>


            {/* ==================================================
                PRODUCT INFO
            ================================================== */}

            <div className="product-info">

              {/* CATEGORY */}

              <p className="product-category">
                {product.category}
              </p>


              {/* NAME */}

              <h1 className="product-title">
                {product.name}
              </h1>


              {/* RATING */}

              <div className="product-rating">

                <span className="rating-stars">
                  ★★★★★
                </span>

                <span className="rating-count">
                  4.8 (124 Reviews)
                </span>

              </div>


              {/* PRICE & DISCOUNT */}

              <div className="product-price">

                <span className="current-price">
                  ₨
                  {currentPrice.toLocaleString()}
                </span>


                {oldPrice !== null &&
                  oldPrice > currentPrice && (
                    <>
                      <span className="old-price">
                        ₨
                        {oldPrice.toLocaleString()}
                      </span>

                      <span className="discount">
                        {discount}% OFF
                      </span>
                    </>
                  )}

              </div>


              {/* DESCRIPTION */}

              <p className="product-description">
                {product.description ||
                  "No description available for this product."}
              </p>


              <div className="product-divider" />


              {/* ==================================================
                  SIZE SELECTOR
              ================================================== */}

              {Array.isArray(product.sizes) &&
                product.sizes.length > 0 && (

                  <div className="product-option">

                    <div className="option-header">

                      <span>
                        Select Size
                      </span>

                      <button
                        type="button"
                        className="size-guide"
                      >
                        Size Guide
                      </button>

                    </div>


                    <div className="size-selector">

                      {product.sizes.map(
                        (size) => (
                          <button
                            type="button"
                            key={size}
                            className={`product-size ${
                              selectedSize === size
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedSize(size)
                            }
                          >
                            {size}
                          </button>
                        )
                      )}

                    </div>

                  </div>
                )}


              {/* ==================================================
                  COLOUR SELECTOR
              ================================================== */}

              {Array.isArray(product.colours) &&
                product.colours.length > 0 && (

                  <div className="product-option">

                    <div className="option-header">

                      <span>
                        Colour:{" "}

                        <span className="selected-option">
                          {selectedColour}
                        </span>
                      </span>

                    </div>


                    <div className="colour-selector">

                      {product.colours.map(
                        (colour) => (

                          <button
                            type="button"
                            key={colour}
                            className={`product-colour ${
                              selectedColour ===
                              colour
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedColour(
                                colour
                              )
                            }
                            style={{
                              backgroundColor:
                                colourValues[
                                  colour
                                ] || "#ccc",
                            }}
                            aria-label={`Select ${colour} colour`}
                          />

                        )
                      )}

                    </div>

                  </div>
                )}


              {/* ==================================================
                  PURCHASE
              ================================================== */}

              <div className="purchase-section">

                {/* QUANTITY */}

                <div className="quantity-selector">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>


                  <span>
                    {quantity}
                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (current) =>
                          current + 1
                      )
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                </div>


                {/* ADD TO CART */}

                <button
                  type="button"
                  className="add-to-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>


                {/* WISHLIST */}

                <button
                  type="button"
                  className={`wishlist-details-button ${
                    saved
                      ? "active"
                      : ""
                  }`}
                  onClick={
                    handleWishlistToggle
                  }
                  aria-label={
                    saved
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >

                  <Heart
                    size={18}
                    fill={
                      saved
                        ? "currentColor"
                        : "none"
                    }
                  />

                </button>

              </div>


              {/* BUY NOW */}

              <button
                type="button"
                className="buy-now"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>


              {/* ==================================================
                  SERVICES
              ================================================== */}

              <div className="product-services">

                {/* FREE DELIVERY */}

                <div className="service-item">

                  <div className="service-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Free Delivery
                    </strong>

                    <p>
                      Free delivery on
                      orders above ₨5,000
                    </p>

                  </div>

                </div>


                {/* RETURNS */}

                <div className="service-item">

                  <div className="service-icon">
                    ↩
                  </div>

                  <div>

                    <strong>
                      Easy Returns
                    </strong>

                    <p>
                      7-day easy return
                      policy
                    </p>

                  </div>

                </div>


                {/* PAYMENT */}

                <div className="service-item">

                  <div className="service-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Secure Payment
                    </strong>

                    <p>
                      Your payment
                      information is
                      protected
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}


export default ProductDetails;