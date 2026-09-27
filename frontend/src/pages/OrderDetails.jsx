import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import "./OrderDetails.css";

const STATUS_LABELS = { pending: "Pending", confirmed: "Confirmed", processing: "Processing", shipped: "In Transit", delivered: "Delivered", cancelled: "Cancelled" };

function OrderDetails() {
  const { id } = useParams();
  const { fetchOrder, cancelOrder } = useOrders();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchOrder(id).then((data) => { if (active) setOrder(data); }).catch((err) => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, fetchOrder]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const updated = await cancelOrder(id);
      setOrder(updated);
      showToast("Order cancelled successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to cancel order", "error");
    }
  };

  if (loading) return <><Navbar /><main className="order-details-page"><div className="container"><div className="order-not-found"><h1>Loading Order...</h1></div></div></main><Footer /></>;
  if (!order || error) return <><Navbar /><main className="order-details-page"><div className="container"><div className="order-not-found"><h1>Order Not Found</h1><p>{error || "We couldn't find this order."}</p><Link to="/orders">Back to Order History</Link></div></div></main><Footer /></>;

  const status = STATUS_LABELS[order.status] || order.status || "Pending";
  const items = order.items || [];
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <Navbar />
      <main className="order-details-page">
        <div className="container">
          <div className="details-top">
            <div><Link to="/orders" className="back-orders">← Back to Orders</Link><h1>Order #{order.id}</h1><p>Placed on {formattedDate}</p></div>
            <span className={`details-status ${status.toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>
          </div>
          <div className="details-layout">
            <section className="details-items">
              <h2>Order Items</h2>
              {items.map((item) => (
                <div className="details-item" key={item.id}>
                  <div className="details-item-image"><img src={item.productImage} alt={item.productName} /></div>
                  <div className="details-item-info">
                    <span>Product</span><h3>{item.productName}</h3>
                    {item.selectedSize && <p>Size: <strong>{item.selectedSize}</strong></p>}
                    {item.selectedColour && <p>Colour: <strong>{item.selectedColour}</strong></p>}
                    <p>Quantity: <strong>{item.quantity}</strong></p>
                  </div>
                  <strong className="details-item-price">₨{Number(item.subtotal || 0).toLocaleString()}</strong>
                </div>
              ))}
            </section>

            <aside className="details-summary">
              <h2>Order Summary</h2>
              <div className="details-row"><span>Subtotal</span><span>₨{Number(order.subtotal || 0).toLocaleString()}</span></div>
              <div className="details-row"><span>Shipping</span><span>{Number(order.shipping_fee || 0) === 0 ? "Free" : `₨${Number(order.shipping_fee).toLocaleString()}`}</span></div>
              <div className="details-row"><span>Tax</span><span>₨{Number(order.tax || 0).toLocaleString()}</span></div>
              <div className="details-divider" />
              <div className="details-total"><span>Total</span><strong>₨{Number(order.total || 0).toLocaleString()}</strong></div>
              <p>Payment: <strong>{order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method === "wallet" ? "Digital Wallet" : "Credit / Debit Card"}</strong></p>
              <p>Shipping to: <strong>{order.address}, {order.city}, {order.country}</strong></p>
              {!['cancelled', 'delivered', 'shipped'].includes(order.status) && <button type="button" className="outline-button danger" onClick={handleCancelOrder}>CANCEL ORDER</button>}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OrderDetails;
