import { createContext, useCallback, useContext, useEffect, useState } from "react";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCartAPI,
} from "../services/api";

const CartContext = createContext(null);

function getToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotalItems, setCartTotalItems] = useState(0);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [forceUpdate, setForceUpdate] = useState(0);

  const applyCart = useCallback((data) => {
    let items = [];
    let totalItems = 0;
    let totalPrice = 0;

    if (Array.isArray(data)) {
      items = data;
      totalItems = data.length;
      totalPrice = data.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    } 
    else if (data && typeof data === 'object' && Array.isArray(data.items)) {
      items = data.items.map((item) => {
        if (item.product) {
          return item;
        }
        if (item.id && item.name) {
          return {
            id: item.id,
            product: item,
            quantity: item.quantity || 1,
            selected_size: item.selected_size || "",
            selected_colour: item.selected_colour || "",
          };
        }
        return item;
      });
      totalItems = Number(data.totalItems ?? items.length);
      totalPrice = Number(data.totalPrice ?? 0);
    }
    else if (data && typeof data === 'object' && data.id) {
      const newItem = {
        id: data.id,
        product: data.product || data,
        quantity: data.quantity || 1,
        selected_size: data.selected_size || "",
        selected_colour: data.selected_colour || "",
        totalItems: data.totalItems || 1,
        totalPrice: data.totalPrice || 0,
      };
      items = [newItem];
      totalItems = newItem.totalItems;
      totalPrice = newItem.totalPrice;
    }

    setCartItems(items);
    setCartTotalItems(totalItems);
    setCartTotalPrice(totalPrice);
    setForceUpdate(prev => prev + 1);
  }, []);

  const loadCart = useCallback(async () => {
    if (!getToken()) {
      applyCart({ items: [], totalItems: 0, totalPrice: 0 });
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      applyCart(data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setError(err.message);
      if (err.message.includes("401") || !getToken()) {
        applyCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [applyCart]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    const handleAuthChange = () => loadCart();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("shopsphere-auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("shopsphere-auth-change", handleAuthChange);
    };
  }, [loadCart]);

  const addToCart = async (product, quantity = 1, selectedSize = null, selectedColour = null) => {
    if (!getToken()) throw new Error("Please login to add items to cart.");
    if (!product?.id) throw new Error("Invalid product.");

    try {
      setError(null);
      console.log("Adding to cart:", { productId: product.id, quantity, selectedSize, selectedColour });
      
      const data = await addCartItem(product.id, quantity, selectedSize, selectedColour);
      applyCart(data);
      
      setTimeout(async () => {
        try {
          const freshData = await getCart();
          applyCart(freshData);
        } catch (err) {
          console.warn("Background cart refresh failed:", err);
        }
      }, 200);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const increaseQuantity = async (itemId) => {
    const item = cartItems.find((cartItem) => String(cartItem.id) === String(itemId));
    if (!item) return;
    try {
      setError(null);
      const data = await updateCartItem(item.id, Number(item.quantity) + 1);
      applyCart(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const decreaseQuantity = async (itemId) => {
    const item = cartItems.find((cartItem) => String(cartItem.id) === String(itemId));
    if (!item) return;
    const newQuantity = Math.max(1, Number(item.quantity) - 1);
    try {
      setError(null);
      const data = await updateCartItem(item.id, newQuantity);
      applyCart(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ✅ ULTIMATE FIX: removeFromCart manually refreshes cart if backend returns empty
  const removeFromCart = async (itemId) => {
    if (!itemId) {
      console.error("removeFromCart called with invalid itemId");
      return;
    }
    
    try {
      setError(null);
      
      // 1. Call the delete API
      await removeCartItem(itemId);
      
      // 2. Force a full cart refresh from backend
      console.log("🔄 Cart item removed. Refreshing cart...");
      const freshData = await getCart();
      applyCart(freshData);
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    if (!getToken()) {
      applyCart({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }
    const data = await clearCartAPI();
    applyCart(data);
  };

  const getCartItem = (itemId) =>
    cartItems.find((item) => String(item.id) === String(itemId));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotalItems,
        cartTotalPrice,
        loading,
        error,
        loadCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCartItem,
        forceUpdate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}