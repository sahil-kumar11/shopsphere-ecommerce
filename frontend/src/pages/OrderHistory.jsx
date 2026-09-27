import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { logoutUser } from "../services/api";
import "./OrderHistory.css";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrderHistory() {
  const { orders, loading, cancelOrder } = useOrders();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const filters = ["All Orders", "Processing", "In Transit", "Delivered", "Cancelled"];

  const getLabel = (status) => STATUS_LABELS[status] || status || "Pending";
  const filteredOrders = activeFilter === "All Orders" ? orders : orders.filter((order) => getLabel(order.status) === activeFilter);

  const handleBuyAgain = async (order) => {
    try {
      for (const item of order.items || []) {
        const product = {
          id: item.productId,
          name: item.productName,
          image: item.productImage,
          price: Number(item.price || 0),
        };
        await addToCart(product, Number(item.quantity || 1), item.selectedSize, item.selectedColour);
      }
      showToast("Order items added to your cart", "success");
    } catch (error) {
      showToast(error.message || "Could not add items to cart", "error");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder(id);
      showToast("Order cancelled successfully", "success");
    } catch (error) {
      showToast(error.message || "Failed to cancel order", "error");
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    window.location.href = "/auth";
  };

  return (
    <>
      <Navbar />
      <main className="order-history-page">
        <div className="container">
          <div className="account-layout">
            <aside className="account-sidebar">
              <Link to="/account">Account Overview</Link>
              <Link to="/orders" className="active">Order History</Link>
              <Link to="/wishlist">Wishlist</Link>
              <div className="sidebar-divider" />
              <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
            </aside>

            <section className="orders-content">
              <div className="orders-heading">
                <h1>Order History</h1>
                <p>You've placed {orders.length} {orders.length === 1 ? "order" : "orders"} with ShopSphere</p>
              </div>

              <div className="order-filters">
                {filters.map((filter) => <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
              </div>

              {loading ? <div className="no-orders"><h2>Loading orders...</h2></div> : filteredOrders.length === 0 ? (
                <div className="no-orders"><h2>No orders found</h2><p>There are no orders in this category.</p></div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map((order) => {
                    const status = getLabel(order.status);
                    const itemCount = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
                    const firstItem = order.items?.[0];
                    const label = firstItem ? `${firstItem.productName}${order.items.length > 1 ? ` + ${order.items.length - 1} more ${order.items.length === 2 ? "item" : "items"}` : ""}` : "No products";
                    return (
                      <article className="order-card" key={order.id}>
                        <div className="order-card-header">
                          <div><span>ORDER</span><strong>#{order.id}</strong></div>
                          <div><span>PLACED ON</span><strong>{new Date(order.created_at).toLocaleDateString("en-PK")}</strong></div>
                          <div><span>ITEMS</span><strong>{itemCount}</strong></div>
                          <span className={`order-status ${status.toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>
                        </div>
                        <div className="order-card-body">
                          <div className="order-images">
                            {(order.items || []).slice(0, 3).map((item) => <div className="order-image" key={item.id}><img src={item.productImage} alt={item.productName} /></div>)}
                          </div>
                          <p className="order-product-name">{label}</p>
                          <strong className="order-total">₨{Number(order.total || 0).toLocaleString()}</strong>
                          <div className="order-actions">
                            {status === "Delivered" && <button className="outline-button" onClick={() => handleBuyAgain(order)}>Buy Again</button>}
                            {!['Delivered', 'Cancelled', 'In Transit'].includes(status) && <button className="outline-button danger" onClick={() => handleCancel(order.id)}>Cancel</button>}
                            <Link to={`/orders/${order.id}`} className="view-order-button">View Details</Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OrderHistory;
