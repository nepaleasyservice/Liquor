import { CheckCircle, Home, ReceiptText } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const { pidx, status, orderId, amount } = state;

  // ✅ Khalti returns amount in paisa, convert to rupees
  const displayAmount =
    amount != null && amount !== "" && !Number.isNaN(Number(amount))
      ? Number(amount) / 100
      : null;

  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center px-6 py-16"
      style={{ color: "#222222" }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center bg-white border border-gray-200 rounded-3xl p-10 shadow-xl"
      >
        <CheckCircle className="mx-auto text-[#D4A056] w-24 h-24 mb-6" />

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-yellow-400 bg-clip-text text-transparent mb-4">
          Payment Successful!
        </h1>

        <p className="text-md leading-relaxed" style={{ color: "#222222" }}>
          Your Khalti payment has been verified and your order is confirmed.
        </p>

        <div className="mt-8 space-y-3 text-sm bg-white p-5 rounded-2xl border border-gray-200 shadow-inner text-left">
          <p>
            ✅ Status:{" "}
            <span className="text-[#B8852E] font-semibold">
              {status || "Completed"}
            </span>
          </p>

          {pidx && (
            <p>
              🧾 Payment ID (pidx):{" "}
              <span className="text-[#B8852E] font-semibold">{pidx}</span>
            </p>
          )}

          {orderId && (
            <p>
              📦 Order ID:{" "}
              <span className="text-[#B8852E] font-semibold">{orderId}</span>
            </p>
          )}

          {displayAmount != null && (
            <p>
              💰 Amount:{" "}
              <span className="text-[#B8852E] font-semibold">
                Rs. {Number(displayAmount).toLocaleString()}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
            border border-[#D4A056] font-semibold transition shadow-sm hover:bg-white"
            style={{ color: "#222222" }}
            onClick={() => window.print()}
          >
            <ReceiptText /> Print Receipt
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
            bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-yellow-400
            text-black font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Home /> Home
          </Link>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="mt-6 text-sm hover:text-[#B8852E] transition"
          style={{ color: "#222222" }}
        >
          View Orders →
        </button>

        <p className="text-sm mt-6 italic" style={{ color: "#222222" }}>
          • Secure Payment • Premium Delivery • Verified by Khalti •
        </p>
      </motion.div>
    </div>
  );
}
