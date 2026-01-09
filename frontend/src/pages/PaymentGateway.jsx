import { CreditCard, Wallet, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import {
  KHALTIPAYMENTURLS,
  STOREDETAILS,
  PAYMENTMETHOD,
} from "../api/constants";
import { useState } from "react";

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();

  const checkoutState = location.state || {};
  const { billing, address } = checkoutState;

  useState(() => {
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
      const orderRes = await api.post(
        KHALTIPAYMENTURLS.getOrdersUrl,
        orderPayload
      );
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

      const initRes = await api.post(
        KHALTIPAYMENTURLS.initiateKhaltiUrl,
        initPayload
      );

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

  return (
    <div className="min-h-screen bg-[#0B0705] pt-32 pb-16 px-6 text-white">
      <h1
        className="text-center text-5xl font-extrabold bg-gradient-to-r
        from-[#D4A056] via-[#f1d39f] to-[#D4A056] bg-clip-text text-transparent
        drop-shadow-[0_0_20px_rgba(212,160,86,0.4)]"
      >
        Payment Gateway
      </h1>

      <div className="max-w-3xl mx-auto mt-14 space-y-12">
        {/* KHALTI PAYMENT (NEW) */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A0E0B]/70 backdrop-blur-xl border border-[#D4A056]/20 
            rounded-3xl p-8 shadow-[0_0_40px_rgba(212,160,86,0.25)] hover:shadow-[0_0_50px_rgba(212,160,86,0.4)] transition-all"
        >
          <div className="flex gap-4 items-center mb-4">
            <CreditCard className="text-[#D4A056]" size={28} />
            <h2 className="text-2xl font-bold text-[#f1d39f]">
              Pay with Khalti
            </h2>
          </div>

          <p className="text-gray-400 mb-6">
            Total:{" "}
            <span className="text-[#f1d39f] font-bold">
              Rs. {total.toLocaleString()}
            </span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            disabled={!cart.length}
            onClick={payWithKhalti}
            className="w-full py-4 rounded-xl font-bold text-lg 
              bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-[#D4A056] 
              bg-[length:200%_200%] animate-goldShimmer text-black shadow-lg 
              shadow-[#D4A056]/50 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Pay with Khalti
          </motion.button>
        </motion.div>

        {/* CARD PAYMENT (keep UI, but this is not real unless you integrate a gateway) */}
        {/* <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[#1A0E0B]/70 backdrop-blur-xl border border-[#D4A056]/20 
            rounded-3xl p-8 shadow-[0_0_40px_rgba(212,160,86,0.25)] hover:shadow-[0_0_50px_rgba(212,160,86,0.4)] transition-all"
        >
          <div className="flex gap-4 items-center mb-6">
            <CreditCard className="text-[#D4A056]" size={28} />
            <h2 className="text-2xl font-bold text-[#f1d39f]">Card Payment</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <input className="checkout-input" placeholder="Card Holder Name" />
            <input className="checkout-input" placeholder="Card Number" />
            <input className="checkout-input" placeholder="MM/YY" />
            <input className="checkout-input" placeholder="CVV" />
          </div>
        </motion.div> */}

        {/* CASH ON DELIVERY */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-[#1A0E0B]/70 backdrop-blur-xl border border-[#D4A056]/20 
            rounded-3xl p-8 shadow-[0_0_40px_rgba(212,160,86,0.25)] hover:shadow-[0_0_50px_rgba(212,160,86,0.4)] transition-all"
        >
          <div className="flex gap-4 items-center mb-4">
            <Wallet className="text-[#D4A056]" size={28} />
            <h2 className="text-2xl font-bold text-[#f1d39f]">
              Cash on Delivery
            </h2>
          </div>

          <p className="text-gray-400 flex gap-2 items-center">
            <MapPin className="text-[#D4A056]" />
            Pay after receiving your order at your location.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            disabled={!cart.length}
            onClick={confirmCOD}
            className="w-full mt-6 py-4 rounded-xl font-bold text-lg 
              bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-[#D4A056] 
              bg-[length:200%_200%] animate-goldShimmer text-black shadow-lg 
              shadow-[#D4A056]/50 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm COD Order
          </motion.button>
        </motion.div>

        <p className="flex items-center gap-2 text-center justify-center text-gray-400 text-sm mt-2">
          <Shield className="text-[#D4A056]" />
          Secure encrypted payment system
        </p>
      </div>

      <style>
        {`
          @keyframes goldShimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-goldShimmer { animation: goldShimmer 3s linear infinite; }

          .checkout-input {
            background: #0E0907;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #3B2519;
            outline: none;
            color: white;
            transition: 0.3s;
          }
          .checkout-input:focus {
            border-color: #D4A056;
            background: #150F0D;
          }
        `}
      </style>
    </div>
  );
}
