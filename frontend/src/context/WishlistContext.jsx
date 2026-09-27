import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useCart } from "./CartContext";

import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlistAPI,
} from "../services/api";

const WishlistContext = createContext(null);

function getToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistTotalItems, setWishlistTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ⚠️ FIX: Force a re-render when wishlist updates
  const [forceUpdate, setForceUpdate] = useState(0);

  const { addToCart } = useCart();

  const applyWishlist = useCallback((data) => {
    const products = (data?.items || [])
      .map((item) => item?.product)
      .filter(Boolean);

    setWishlistItems(products);
    setWishlistTotalItems(
      Number(data?.totalItems ?? products.length)
    );
    // Trigger re-render
    setForceUpdate(prev => prev + 1);
  }, []);

  const loadWishlist = useCallback(async () => {
    if (!getToken()) {
      applyWishlist({ items: [] });
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getWishlist();

      applyWishlist(data);
    } catch (err) {
      setError(err.message);
      applyWishlist({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [applyWishlist]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    const handleAuthChange = () => {
      loadWishlist();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener(
      "shopsphere-auth-change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener(
        "shopsphere-auth-change",
        handleAuthChange
      );
    };
  }, [loadWishlist]);

  const isInWishlist = useCallback(
    (productId) =>
      wishlistItems.some(
        (item) => String(item.id) === String(productId)
      ),
    [wishlistItems]
  );

  const addToWishlist = async (product) => {
    if (!getToken()) {
      throw new Error("Please login to add items to wishlist.");
    }

    if (!product?.id) {
      throw new Error("Invalid product.");
    }

    if (isInWishlist(product.id)) {
      return;
    }

    try {
      setError(null);

      // 1. Send request to backend
      const data = await addWishlistItem(product.id);

      // 2. Immediately update local state
      applyWishlist(data);

      // 3. Force a full re-fetch from backend to ensure sync
      setTimeout(async () => {
        try {
          const freshData = await getWishlist();
          applyWishlist(freshData);
        } catch (err) {
          console.warn("Background wishlist refresh failed:", err);
        }
      }, 200);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!getToken()) {
      return;
    }

    try {
      setError(null);

      // 1. Send request to backend
      const data = await removeWishlistItem(productId);

      // 2. Immediately update local state
      applyWishlist(data);

      // 3. Force a full re-fetch from backend to ensure sync
      setTimeout(async () => {
        try {
          const freshData = await getWishlist();
          applyWishlist(freshData);
        } catch (err) {
          console.warn("Background wishlist refresh failed:", err);
        }
      }, 200);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleWishlist = async (product) => {
    if (!product?.id) {
      throw new Error("Invalid product.");
    }

    if (isInWishlist(product.id)) {
      return removeFromWishlist(product.id);
    }

    return addToWishlist(product);
  };

  const addWishlistItemToCart = async (product) => {
    const selectedSize = product?.sizes?.[0] || null;
    const selectedColour = product?.colours?.[0] || null;

    return addToCart(
      product,
      1,
      selectedSize,
      selectedColour
    );
  };

  const addAllToCart = async () => {
    for (const product of wishlistItems) {
      await addWishlistItemToCart(product);
    }
  };

  const clearWishlist = async () => {
    if (!getToken()) {
      applyWishlist({ items: [] });
      return;
    }

    try {
      setError(null);

      const data = await clearWishlistAPI();

      applyWishlist(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistTotalItems,
        loading,
        error,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        addWishlistItemToCart,
        addAllToCart,
        clearWishlist,
        refreshWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}