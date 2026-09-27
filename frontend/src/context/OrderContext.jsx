import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getOrders,
  getOrder,
  createOrder as createOrderAPI,
  cancelOrder as cancelOrderAPI,
} from "../services/api";

const OrderContext = createContext(null);

function getToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!getToken()) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getOrders();

      setOrders(
        Array.isArray(data)
          ? data
          : data?.results || []
      );
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const handleAuthChange = () => {
      loadOrders();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener(
      "shopsphere-auth-change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleAuthChange
      );

      window.removeEventListener(
        "shopsphere-auth-change",
        handleAuthChange
      );
    };
  }, [loadOrders]);

  const fetchOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getOrder(orderId);

      setCurrentOrder(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const data = await createOrderAPI(orderData);

      setCurrentOrder(data);

      setOrders((current) => [
        data,
        ...current.filter(
          (order) =>
            String(order.id) !== String(data.id)
        ),
      ]);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await cancelOrderAPI(orderId);

      setCurrentOrder(data);

      setOrders((current) =>
        current.map((order) =>
          String(order.id) === String(orderId)
            ? data
            : order
        )
      );

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        loadOrders,
        fetchOrder,
        createOrder,
        cancelOrder,
        clearCurrentOrder,
        refreshOrders: loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrders must be used inside OrderProvider"
    );
  }

  return context;
}

export function useOrder() {
  return useOrders();
}