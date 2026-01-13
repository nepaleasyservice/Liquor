import { useState, useContext } from "react";
import { Mail } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { forgotPassword } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMsg(res?.message || "If an account exists, we sent a reset link.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-28 pb-16" style={{ color: "#222222" }}>
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-wide bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent">
          Forgot Password
        </h1>

        {msg && !error && <p className="text-green-700 text-center mb-4">{msg}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block">Email</label>
            <div className="flex items-center bg-white rounded-xl border border-gray-300 px-4 focus-within:ring-2 focus-within:ring-[#D4A056]">
              <Mail className="w-5 h-5" style={{ color: "#222222" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
                style={{ color: "#222222" }}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg shadow-md transition ${
              loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black hover:shadow-lg"
            }`}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-[#D4A056] py-3 rounded-xl font-semibold text-lg transition hover:bg-[#F7E7B4]"
            style={{ color: "#222222" }}
          >
            Back to Login
          </button>
        </form>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
