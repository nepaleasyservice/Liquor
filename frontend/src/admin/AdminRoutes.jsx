import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Users from "./Users";
import Settings from "./Settings";
import Enjoy from "./Enjoy";
import ProtectedAdminRoute from "../auth/ProtectedAdminRoute";
import { useAuth } from "../auth/AuthContext.jsx";
import Orders from "../admin/Orders.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import Products from "./AdminProducts.jsx";

export default function AdminRoutes() {
  const { token, ready } = useAuth();

  // ✅ wait for auth hydration to avoid redirect loops
  if (!ready) return null; // or a loading spinner

  return (
    <>
      {token ? <AdminNavbar /> : null}

      <Routes>
        <Route path="login" element={<AdminLogin />} />

        <Route
          path="dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="products"
          element={
            <ProtectedAdminRoute>
              <Products />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="users"
          element={
            <ProtectedAdminRoute>
              <Users />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedAdminRoute>
              <Settings />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="enjoy"
          element={
            <ProtectedAdminRoute>
              <Enjoy />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedAdminRoute>
              <Orders />
            </ProtectedAdminRoute>
          }
        />

        {/* ✅ /admin -> dashboard if logged in else login */}
        <Route
          index
          element={
            token ? (
              <Navigate to="dashboard" replace />
            ) : (
              <Navigate to="login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}
