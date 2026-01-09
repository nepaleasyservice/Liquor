import { BrowserRouter, Routes, Route } from "react-router-dom";

// USER LAYOUT
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// USER PAGES
import Home from "./pages/Home";
import About from "./pages/About";
import Liquors from "./pages/Liquors";
import Offers from "./pages/Offers";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import PaymentGateway from "./pages/PaymentGateway";
import CompletePurchase from "./pages/CompletePurchase";
import ProductPage from "./pages/ProductPage";
import TrendingProductPage from "./pages/TrendingProductPage";
import KhaltiCallback from "./pages/khaltiCallback";

// ADMIN
import AdminRoutes from "./admin/AdminRoutes";

// ROUTE GUARDS
import PublicOnlyRoute from "./auth/PublicOnlyRoute";
import ScrollToTop from "./components/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import UserOrders from "./pages/UserOrders";

/* ---------------- USER LAYOUT ---------------- */
function UserLayout() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Liquors />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* 🔐 LOGIN (email verification lands here) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute allowVerified>
              <Auth />
            </PublicOnlyRoute>
          }
        />

        {/* 🔐 AUTH (normal login/signup) */}
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />

        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/complete" element={<CompletePurchase />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/trending/:id" element={<TrendingProductPage />} />
        <Route path="/khalti/callback" element={<KhaltiCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/orders" element={<UserOrders />} />

      </Routes>

      <Footer />
    </>
  );
}

/* ---------------- APP ROOT ---------------- */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* ADMIN ROUTES */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* USER SITE */}
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
