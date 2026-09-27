import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import "./Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { createOrder, loading } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "",
    city: "", postalCode: "", country: "Pakistan", cardNumber: "", expiryDate: "", cvv: "",
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product || item;
    return sum + Number(product?.price || 0) * Number(item.quantity || 1);
  }, 0);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250;
  const tax = Math.round(subtotal * 0.0688);
  const total = subtotal + shipping + tax;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cartItems.length) {
      navigate("/shop");
      return;
    }

    try {
      const response = await createOrder({
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postal_code: formData.postalCode.trim(),
        country: formData.country,
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          id: item.product?.id || item.id,
          quantity: Number(item.quantity || 1),
          selectedSize: item.selectedSize || null,
          selectedColour: item.selectedColour || null,
        })),
      });

      setOrderId(response.id);
      await clearCart();
      setOrderPlaced(true);
      showToast("Order placed successfully!", "success");
    } catch (error) {
      showToast(error.message || "Failed to place order. Please try again.", "error");
    }
  };

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <div className="checkout-container checkout-success">
          <div className="success-icon"><Check size={28} /></div>
          <p className="checkout-eyebrow">Order Confirmed</p>
          <h1>Thank You For Your Order</h1>
          <p className="success-message">Your order has been placed successfully. Order #{orderId}<br />We'll send your order details to your email address.</p>
          <div className="checkout-success-actions">
            <Link to="/orders" className="back-to-shop">View Order History</Link>
            <Link to="/shop" className="back-to-shop">Continue Shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-container">
          <Link to="/" className="checkout-logo">shop<span>•</span>sphere</Link>
          <div className="secure-checkout"><Lock size={13} /> Secure Checkout</div>
        </div>
      </header>

      <div className="checkout-steps">
        <div className="checkout-step completed"><span className="step-number"><Check size={13} /></span><span>Cart</span></div>
        <div className="step-line" />
        <div className="checkout-step active"><span className="step-number">2</span><span>Shipping & Payment</span></div>
        <div className="step-line" />
        <div className="checkout-step"><span className="step-number">3</span><span>Confirmation</span></div>
      </div>

      {cartItems.length === 0 ? (
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add some products before proceeding to checkout.</p>
          <Link to="/shop" className="back-to-shop">Continue Shopping</Link>
        </div>
      ) : (
        <form className="checkout-container" onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-main">
              <section className="checkout-card">
                <div className="checkout-section-title"><span className="section-number">1</span><h2>Contact & Shipping Address</h2></div>
                <div className="form-grid">
                  <div className="form-group"><label htmlFor="firstName">First Name</label><input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
                  <div className="form-group"><label htmlFor="lastName">Last Name</label><input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
                </div>
                <div className="form-group"><label htmlFor="email">Email Address</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="phone">Phone Number</label><input id="phone" name="phone" type="tel" placeholder="+92 300 1234567" value={formData.phone} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="address">Street Address</label><input id="address" name="address" value={formData.address} onChange={handleChange} required /></div>
                <div className="form-grid">
                  <div className="form-group"><label htmlFor="city">City</label><input id="city" name="city" value={formData.city} onChange={handleChange} required /></div>
                  <div className="form-group"><label htmlFor="postalCode">Postal Code</label><input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required /></div>
                </div>
                <div className="form-group"><label htmlFor="country">Country</label><select id="country" name="country" value={formData.country} onChange={handleChange}><option>Pakistan</option><option>United Arab Emirates</option><option>United Kingdom</option><option>United States</option></select></div>
              </section>

              <section className="checkout-card">
                <div className="checkout-section-title"><span className="section-number">2</span><h2>Payment Method</h2></div>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === "card" ? "selected" : ""}`}><input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Credit / Debit Card</span></label>
                  <label className={`payment-option ${paymentMethod === "wallet" ? "selected" : ""}`}><input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === "wallet"} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Digital Wallet (Easypaisa / JazzCash)</span></label>
                  <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}><input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} /><span>Cash on Delivery</span></label>
                </div>
                {paymentMethod === "card" && <div className="payment-message">Card processing is not connected to a payment gateway yet. No card details are stored by ShopSphere.</div>}
                {paymentMethod === "wallet" && <div className="payment-message">Digital wallet processing is not connected to a gateway yet. The selected method will be stored with your order.</div>}
                {paymentMethod === "cod" && <div className="payment-message">Pay in cash when your order is delivered to your address.</div>}
              </section>
            </div>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>
              <div className="checkout-products">
                {cartItems.map((item, index) => {
                  const product = item.product || item;
                  return <div className="checkout-product" key={item.id || index}>
                    <div className="checkout-product-image"><img src={product.image} alt={product.name} /></div>
                    <div className="checkout-product-info"><h3>{product.name}</h3><p>{item.selectedColour || ""}{item.selectedSize ? ` • Size ${item.selectedSize}` : ""}{` • Qty ${item.quantity || 1}`}</p></div>
                    <span className="checkout-product-price">₨{(Number(product.price || 0) * Number(item.quantity || 1)).toLocaleString()}</span>
                  </div>;
                })}
              </div>
              <div className="checkout-summary-row"><span>Subtotal</span><span>₨{subtotal.toLocaleString()}</span></div>
              <div className="checkout-summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₨${shipping.toLocaleString()}`}</span></div>
              <div className="checkout-summary-row"><span>Tax</span><span>₨{tax.toLocaleString()}</span></div>
              <div className="checkout-summary-divider" />
              <div className="checkout-total"><span>Total</span><strong>₨{total.toLocaleString()}</strong></div>
              <button type="submit" className="place-order-button" disabled={loading}>{loading ? "Placing Order..." : "Place Order"}</button>
              <p className="secure-payment"><Lock size={12} /> 256-bit SSL Encrypted</p>
            </aside>
          </div>
        </form>
      )}
    </main>
  );
}

export default Checkout;
