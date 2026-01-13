import { CreditCard, Wallet, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { KHALTIPAYMENTURLS, STOREDETAILS, PAYMENTMETHOD } from "../api/constants";
import { useEffect } from "react";

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();

  const checkoutState = location.state || {};
  const { billing, address } = checkoutState;

  useEffect(() => {
    if (!billing || !address) navigate("/checkout", { replace: true });
  }, [billing, address, navigate]);

  const subtotal = cart.reduce((t, i) => t + i.price * i.qty, 0);
  const deliveryFee = cart.length ? 150 : 0;
  const total = subtotal + deliveryFee;

  const payWithKhalti = async () => {
    if (!cart.length) return;

    const orderPayload = {
      items: cart.map((i) => ({
        productId: i._id || i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        imageUrl: i.image.url,
      })),
      subtotal,
      deliveryFee,
      total,
      billing,
      address,
      paymentMethod: PAYMENTMETHOD.KHALTI,
    };

    try {
      const orderRes = await api.post(KHALTIPAYMENTURLS.getOrdersUrl, orderPayload);
      const orderJson = orderRes.data;

      if (!orderJson?.success) {
        alert(orderJson?.message || "Failed to create order.");
        return;
      }

      const purchase_order_id = orderJson.order.orderId;

      const initPayload = {
        amountPaisa: Math.round(total * 100),
        purchase_order_id,
        purchase_order_name: STOREDETAILS.NAME,
        customer_info: {
          name: orderJson.order.deliveryAddress.fullName,
          email: orderJson.order.deliveryAddress.email,
          phone: orderJson.order.deliveryAddress.phone,
        },
        product_details: cart.map((item) => ({
          identity: String(item._id || item.id),
          name: item.name,
          quantity: item.qty,
          unit_price: Math.round(item.price * 100),
          total_price: Math.round(item.price * item.qty * 100),
        })),
      };

      const initRes = await api.post(KHALTIPAYMENTURLS.initiateKhaltiUrl, initPayload);
      const initJson = initRes.data;

      if (!initJson?.success) {
        alert(initJson?.message || "Failed to initiate Khalti payment.");
        return;
      }

      window.location.href = initJson.data.payment_url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong while starting payment.");
    }
  };

  const confirmCOD = () => {
    if (!cart.length) return;
    clearCart?.();
    navigate("/complete");
  };

  const canPay = cart.length > 0;

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-6" style={{ color: "#222222" }}>
      <h1
        className="text-center text-5xl font-extrabold bg-gradient-to-r
        from-[#D4A056] via-[#f1d39f] to-[#D4A056] bg-clip-text text-transparent"
      >
        Payment Gateway
      </h1>

      <div className="max-w-3xl mx-auto mt-14 space-y-12">
        {/* KHALTI PAYMENT */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex gap-4 items-center mb-4">
            <CreditCard className="text-[#D4A056]" size={28} />
            <h2 className="text-2xl font-bold text-[#B8852E]">Pay with Khalti</h2>
          </div>

          <p className="mb-6" style={{ color: "#222222" }}>
            Total:{" "}
            <span className="font-bold" style={{ color: "#222222" }}>
              Rs. {total.toLocaleString()}
            </span>
          </p>

          <motion.button
            whileHover={{ scale: canPay ? 1.03 : 1 }}
            disabled={!canPay}
            onClick={payWithKhalti}
            className={`w-full py-4 rounded-xl font-bold text-lg
              bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-[#D4A056]
              text-black shadow-md hover:shadow-lg transition-all duration-300
              ${!canPay ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
          >
            Pay with Khalti
          </motion.button>
        </motion.div>

        {/* CASH ON DELIVERY */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex gap-4 items-center mb-4">
            <Wallet className="text-[#D4A056]" size={28} />
            <h2 className="text-2xl font-bold text-[#B8852E]">Cash on Delivery</h2>
          </div>

          <p className="flex gap-2 items-center" style={{ color: "#222222" }}>
            <MapPin className="text-[#D4A056]" />
            Pay after receiving your order at your location.
          </p>

          <motion.button
            whileHover={{ scale: canPay ? 1.03 : 1 }}
            disabled={!canPay}
            onClick={confirmCOD}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg
              bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-[#D4A056]
              text-black shadow-md hover:shadow-lg transition-all duration-300
              ${!canPay ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
          >
            Confirm COD Order
          </motion.button>
        </motion.div>

        <p className="flex items-center gap-2 text-center justify-center text-sm mt-2" style={{ color: "#222222" }}>
          <Shield className="text-[#D4A056]" />
          Secure encrypted payment system
        </p>
      </div>
    </div>
  );
}
