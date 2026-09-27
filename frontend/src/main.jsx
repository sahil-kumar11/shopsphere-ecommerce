import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrderProvider } from "./context/OrderContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);