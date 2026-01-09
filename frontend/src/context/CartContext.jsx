import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";

const CartContext = createContext(null);

const CART_KEY = "cartItems";

const normalizeProduct = (product) => {
  const id = product._id ?? product.id;
  return { ...product, id };
};

export function CartProvider({ children }) {
  const { user, isLoggedIn, authLoading } = useContext(UserContext);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      setCart([]);
      try {
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem("cart");
      } catch {}
    }
  }, [authLoading, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, isLoggedIn]);

  const addToCart = (product, qty = 1) => {
    if (authLoading) return;

    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }

    const p = normalizeProduct(product);
    if (!p.id) return;

    setCart((prev) => {
      const existing = prev.find((x) => x.id === p.id);
      if (existing) {
        return prev.map((x) =>
          x.id === p.id ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [...prev, { ...p, qty }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((x) => x.id !== id));

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem("cart");
    } catch {}
  };

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
      user,
    }),
    [cart, user]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
