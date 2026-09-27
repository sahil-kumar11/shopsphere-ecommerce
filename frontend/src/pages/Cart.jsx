import { Link } from "react-router-dom";

import {
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

import "./Cart.css";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { showToast } = useToast();

  /*
   * ============================================================
   * TOTALS
   * ============================================================
   */

  const subtotal = cartItems.reduce(
    (total, item) => {
      const product =
        item?.product || item;

      const price = Number(
        product?.price ||
          item?.price ||
          0
      );

      const quantity = Number(
        item?.quantity || 1
      );

      return total + price * quantity;
    },
    0
  );

  const delivery =
    subtotal >= 5000 || subtotal === 0
      ? 0
      : 250;

  const tax = Math.round(
    subtotal * 0.0688
  );

  const total =
    subtotal + delivery + tax;

  /*
   * ============================================================
   * REMOVE ITEM
   * ============================================================
   */

  const handleRemoveItem = (
    item,
    index
  ) => {
    // ✅ FIX: Ensure we pass the correct CartItem ID
    const itemId = item?.id || item?.cart_item_id;

    if (!itemId) {
      showToast("Could not find item ID to remove. Please refresh the page.", "error");
      return;
    }

    console.log("🔄 Removing item with ID:", itemId);
    removeFromCart(itemId);

    const product =
      item?.product || item;

    showToast(
      `${product?.name || "Item"} removed from cart`,
      "error"
    );
  };

  /*
   * ============================================================
   * CLEAR CART
   * ============================================================
   */

  const handleClearCart = async () => {
    if (cartItems.length === 0) {
      return;
    }

    try {
      await clearCart();

      showToast(
        "Cart cleared successfully",
        "error"
      );
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );

      showToast(
        error?.message ||
          "Failed to clear cart",
        "error"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <div className="container">

          {/* HEADER */}

          <div className="cart-header">
            <p className="cart-eyebrow">
              Your Shopping Bag
            </p>

            <h1 className="cart-title">
              Shopping Cart
            </h1>
          </div>

          {/* EMPTY CART */}

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <ShoppingBag
                  size={48}
                  strokeWidth={1.2}
                />
              </div>

              <h2>
                Your cart is empty
              </h2>

              <p>
                You haven't added anything
                to your cart yet.
              </p>

              <Link
                to="/shop"
                className="continue-shopping"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-layout">

              {/* CART ITEMS */}

              <section className="cart-items">
                <div className="cart-items-header">
                  <div className="cart-items-header-left">
                    <h2>
                      Your Items
                    </h2>

                    <span className="cart-items-count">
                      {cartItems.length}{" "}
                      {cartItems.length === 1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="clear-cart"
                    onClick={
                      handleClearCart
                    }
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="cart-item-list">
                  {cartItems.map(
                    (item, index) => {
                      const product =
                        item?.product ||
                        item;

                      const price =
                        Number(
                          product?.price ||
                            item?.price ||
                            0
                        );

                      const quantity =
                        Number(
                          item?.quantity ||
                            1
                        );

                      return (
                        <div
                          key={`${
                            item?.id ||
                            product?.id ||
                            "item"
                          }-${index}`}
                          className="cart-item"
                        >
                          {/* IMAGE */}

                          <div className="cart-item-image">
                            <img
                              src={
                                product?.image && product.image.trim() !== ""
                                  ? product.image
                                  : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                              }
                              alt={
                                product?.name ||
                                "Product"
                              }
                            />
                          </div>

                          {/* INFO */}

                          <div className="cart-item-info">
                            <div>
                              <p className="cart-item-category">
                                {
                                  product?.category
                                }
                              </p>

                              <h3>
                                {
                                  product?.name
                                }
                              </h3>

                              <div className="cart-item-variants">
                                {item?.selectedSize && (
                                  <span>
                                    Size:{" "}
                                    <strong>
                                      {
                                        item.selectedSize
                                      }
                                    </strong>
                                  </span>
                                )}

                                {item?.selectedColour && (
                                  <span>
                                    Colour:{" "}
                                    <strong>
                                      {
                                        item.selectedColour
                                      }
                                    </strong>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* ACTIONS */}

                            <div className="cart-item-actions">
                              <div className="cart-quantity">
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(
                                      item.id
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
                                    increaseQuantity(
                                      item.id
                                    )
                                  }
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                className="remove-item"
                                onClick={() =>
                                  handleRemoveItem(
                                    item,
                                    index
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* PRICE */}

                          <div className="cart-item-price">
                            ₨
                            {(
                              price *
                              quantity
                            ).toLocaleString()}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </section>

              {/* SUMMARY */}

              <aside className="cart-summary">
                <h2>
                  Order Summary
                </h2>

                <div className="summary-row">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₨
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="summary-row">
                  <span>
                    Delivery
                  </span>

                  <span>
                    {delivery === 0
                      ? "Free"
                      : `₨${delivery.toLocaleString()}`}
                  </span>
                </div>

                <div className="summary-row">
                  <span>
                    Tax
                  </span>

                  <span>
                    ₨
                    {tax.toLocaleString()}
                  </span>
                </div>

                <div className="summary-divider" />

                <div className="summary-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    ₨
                    {total.toLocaleString()}
                  </strong>
                </div>

                <Link
                  to="/checkout"
                  className="checkout-button"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/shop"
                  className="continue-shopping-link"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cart;