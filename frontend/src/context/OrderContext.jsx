import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";
import api from "../services/api";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { isLoggedIn, authLoading } = useContext(UserContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserOrders = async (paymentStatus) => {
    setError("");
    setLoading(true);

    try {

      const res = await api.get("/orders/get", {
        params: paymentStatus ? { paymentStatus } : undefined,
      });

      // ✅ your backend returns ARRAY directly (as seen in your screenshot)
      const list = Array.isArray(res.data) ? res.data : (res.data?.orders || []);

      setOrders(list);
      return { success: true, orders: list };
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Failed to fetch orders";
      setOrders([]);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      setOrders([]);
      return;
    }

    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isLoggedIn]);

  const value = useMemo(
    () => ({
      orders,
      loading,
      error,
      fetchUserOrders,
    }),
    [orders, loading, error]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
};
