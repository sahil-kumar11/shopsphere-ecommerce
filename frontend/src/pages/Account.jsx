import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, LogOut, Award, Circle, Edit2, Phone, Calendar, Mail, ShoppingBag, Clock, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser, updateCurrentUser, logoutUser } from "../services/api";
import { useOrders } from "../context/OrderContext";
import { useWishlist } from "../context/WishlistContext";
import "./Account.css";

function Account() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { wishlistItems } = useWishlist();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((data) => {
      if (!active) return;
      setUser(data);
      setEditData({ name: data.name || "", email: data.email || "" });
    }).catch(() => navigate("/auth", { replace: true }));
    return () => { active = false; };
  }, [navigate]);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const updated = await updateCurrentUser(editData);
      setUser(updated);
      setEditData({ name: updated.name || "", email: updated.email || "" });
      setIsEditing(false);
    } catch (error) {
      window.alert(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    navigate("/auth", { replace: true });
  };

  if (!user) {
    return <div className="account-loading"><div className="spinner" /><p>Loading your account...</p></div>;
  }

  const lifetimeSpend = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const recentOrders = orders.slice(0, 3);
  const getInitials = (name) => (name || "U").split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="account-page">
        <div className="container">
          <div className="account-layout">
            <aside className="account-sidebar">
              <Link to="/account" className="sidebar-item active"><User size={18} /><span>Dashboard</span></Link>
              <Link to="/orders" className="sidebar-item"><Package size={18} /><span>Orders</span></Link>
              <Link to="/wishlist" className="sidebar-item"><Heart size={18} /><span>Wishlist</span></Link>
              <button className="sidebar-signout" onClick={handleSignOut}><LogOut size={18} /><span>Sign Out</span></button>
            </aside>

            <div className="account-main">
              <div className="profile-header">
                <div className="profile-avatar"><span>{getInitials(user.name)}</span></div>
                <div className="profile-info">
                  <div className="profile-name-row">
                    <h1>{user.name}</h1>
                    <span className="circle-badge"><Circle size={12} /> SHOPSPHERE MEMBER</span>
                    <button className="edit-profile-btn" onClick={() => setIsEditing((value) => !value)}><Edit2 size={14} />{isEditing ? "Cancel" : "Edit"}</button>
                  </div>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-member"><Clock size={14} /> Member since {user.memberSince || "Recently"}</p>
                </div>
              </div>

              {isEditing && (
                <form className="edit-profile-form" onSubmit={handleEditSubmit}>
                  <div className="edit-form-grid">
                    <div className="form-group"><label>Full Name</label><input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} required /></div>
                    <div className="form-group"><label>Email Address</label><input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} required /></div>
                  </div>
                  <div className="edit-form-actions"><button type="submit" className="save-btn" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button><button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button></div>
                </form>
              )}

              <div className="stats-grid">
                <div className="stat-card"><ShoppingBag size={20} className="stat-icon" /><div><p className="stat-value">{orders.length}</p><p className="stat-label">Total Orders</p></div></div>
                <div className="stat-card"><Award size={20} className="stat-icon" /><div><p className="stat-value">₨{lifetimeSpend.toLocaleString()}</p><p className="stat-label">Lifetime Spend</p></div></div>
                <div className="stat-card"><Heart size={20} className="stat-icon" /><div><p className="stat-value">{wishlistItems.length}</p><p className="stat-label">Wishlist Items</p></div></div>
                <div className="stat-card"><Star size={20} className="stat-icon" /><div><p className="stat-value">100</p><p className="stat-label">Reward Points</p></div></div>
              </div>

              <section className="account-section">
                <div className="section-header"><h2>Personal Information</h2></div>
                <div className="info-grid">
                  <div className="info-item"><label><User size={14} /> Full Name</label><p>{user.name}</p></div>
                  <div className="info-item"><label><Mail size={14} /> Email Address</label><p>{user.email}</p></div>
                  <div className="info-item"><label><Phone size={14} /> Phone Number</label><p>Provided at checkout</p></div>
                  <div className="info-item"><label><Calendar size={14} /> Member Since</label><p>{user.memberSince || "Recently"}</p></div>
                </div>
              </section>

              <section className="account-section">
                <div className="section-header"><h2>Recent Orders</h2><Link to="/orders">View All</Link></div>
                {recentOrders.length === 0 ? <p>No orders yet. <Link to="/shop">Start shopping</Link>.</p> : recentOrders.map((order) => (
                  <Link to={`/orders/${order.id}`} className="recent-order" key={order.id}>
                    <div><strong>Order #{order.id}</strong><span>{new Date(order.created_at).toLocaleDateString("en-PK")}</span></div>
                    <div><strong>₨{Number(order.total || 0).toLocaleString()}</strong><span>{order.status}</span></div>
                  </Link>
                ))}
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Account;
