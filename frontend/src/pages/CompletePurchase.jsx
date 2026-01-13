import { CheckCircle, Download, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CompletePurchase() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16" style={{ color: "#222222" }}>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center bg-white border border-gray-200 rounded-3xl p-10 shadow-xl"
      >
        <CheckCircle className="mx-auto text-[#D4A056] w-24 h-24 mb-6" />

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-yellow-400 bg-clip-text text-transparent mb-4">
          Order Successful!
        </h1>

        <p className="text-md leading-relaxed" style={{ color: "#222222" }}>
          Thank you for shopping with{" "}
          <span className="text-[#D4A056] font-semibold">GlamGear Liquor</span>.
          Your premium order has been placed and will arrive within 24–48 hours.
        </p>

        <div className="mt-8 space-y-3 text-sm bg-white p-5 rounded-2xl border border-gray-200" style={{ color: "#222222" }}>
          <p>
            📦 Order ID: <span className="text-[#D4A056] font-semibold">#LIQR2489</span>
          </p>
          <p>🚚 Delivery: Within 24–48 hours</p>
          <p>📍 Address: As provided during checkout</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#D4A056] font-semibold transition shadow-sm hover:bg-[#F7E7B4]" style={{ color: "#222222" }}>
            <Download /> Invoice
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-yellow-400 text-black font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Home /> Home
          </Link>
        </div>

        <p className="text-sm mt-6" style={{ color: "#222222" }}>
          • Secure Payment • Premium Delivery • 100% Satisfaction Guaranteed •
        </p>
      </motion.div>
    </div>
  );
}
