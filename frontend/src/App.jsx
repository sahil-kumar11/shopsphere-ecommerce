import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import FeaturedProducts from "./components/FeaturedProducts";
import NewArrivals from "./components/NewArrivals";
import MembershipBanner from "./components/MembershipBanner";
import Footer from "./components/Footer";

import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import Account from "./pages/Account";
import Auth from "./pages/Auth";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <CategorySection />

        <FeaturedProducts />

        <NewArrivals />

        <MembershipBanner />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/auth"
          element={<Auth />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails />
          }
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<OrderHistory />}
        />

        <Route
          path="/orders/:id"
          element={
            <OrderDetails />
          }
        />

        <Route
          path="/account"
          element={<Account />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Home />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;