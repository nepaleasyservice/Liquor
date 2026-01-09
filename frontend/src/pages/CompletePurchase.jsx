import { CheckCircle, Download, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CompletePurchase() {
  return (
    <div className="min-h-screen bg-[#0B0705] flex items-center justify-center px-6 py-16">

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center bg-[#1A0E0B]/70 backdrop-blur-xl
        border border-[#D4A056]/20 rounded-3xl p-10 shadow-[0_0_50px_rgba(212,160,86,0.25)]
        hover:shadow-[0_0_60px_rgba(212,160,86,0.4)] transition-all"
      >

        <CheckCircle className="mx-auto text-[#D4A056] w-24 h-24 mb-6 drop-shadow-[0_0_20px_rgba(212,160,86,0.5)]" />

        <h1 className="text-4xl font-extrabold bg-gradient-to-r
        from-[#D4A056] via-[#f1d39f] to-yellow-400 bg-clip-text text-transparent
        drop-shadow-[0_0_20px_rgba(212,160,86,0.3)] mb-4">
          Order Successful!
        </h1>

        <p className="text-gray-300 text-md leading-relaxed">
          Thank you for shopping with <span className="text-[#D4A056] font-semibold">GlamGear Liquor</span>.  
          Your premium order has been placed and will arrive within 24–48 hours.
        </p>

        {/* ORDER DETAILS */}
        <div className="mt-8 space-y-3 text-gray-300 text-sm bg-[#0E0907]/50 p-5 rounded-2xl border border-[#D4A056]/15 shadow-inner">
          <p>📦 Order ID: <span className="text-[#D4A056] font-semibold">#LIQR2489</span></p>
          <p>🚚 Delivery: Within 24–48 hours</p>
          <p>📍 Address: As provided during checkout</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
          border border-[#D4A056] text-[#D4A056] font-semibold hover:bg-[#D4A056]
          hover:text-black transition-all shadow-md hover:shadow-lg">
            <Download /> Invoice
          </button>

          <Link to="/" className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
          bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-yellow-400
          text-black font-semibold shadow-md hover:shadow-lg transition-all">
            <Home /> Home
          </Link>

        </div>

        {/* THANK YOU NOTE */}
        <p className="text-gray-400 text-sm mt-6 italic">
          • Secure Payment • Premium Delivery • 100% Satisfaction Guaranteed •
        </p>

      </motion.div>

      {/* GOLD SHIMMER ANIMATION */}
      <style>{`
        .gold-shimmer {
          background: linear-gradient(90deg, #D4A056, #f1d39f, #D4A056);
          background-size: 300% 100%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

    </div>
  );
}
