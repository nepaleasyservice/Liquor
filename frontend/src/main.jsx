// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx"; // ✅ add this

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <AuthProvider>
        <UserProvider>
          <OrderProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </OrderProvider>
        </UserProvider>
      </AuthProvider>
    </AdminProvider>
  </StrictMode>
);
