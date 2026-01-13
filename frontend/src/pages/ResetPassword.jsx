import { useState, useContext, useMemo } from "react";
import { Lock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ResetPassword() {
  const { resetPassword } = useContext(UserContext);
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!token) return setError("Reset token missing.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await resetPassword({ token, password });
      setMsg(res?.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white px-4 pt-28 pb-16 bg-[url('/whiskey-bg.jpg')] bg-cover bg-center"
      style={{ color: "#222222" }}
    >
      {/* solid overlay (no opacity, no blur) */}
      <div className="absolute inset-0 bg-white" />

      <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-wide bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent">
          Reset Password
        </h1>

        {msg && !error && <p className="text-green-700 text-center mb-4">{msg}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block" style={{ color: "#222222" }}>
              New Password
            </label>
            <div className="flex items-center bg-white rounded-xl border border-gray-300 px-4 focus-within:ring-2 focus-within:ring-[#D4A056]">
              <Lock className="w-5 h-5" style={{ color: "#222222" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent py-3 px-3 focus:outline-none"
                style={{ color: "#222222" }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block" style={{ color: "#222222" }}>
              Confirm Password
            </label>
            <div className="flex items-center bg-white rounded-xl border border-gray-300 px-4 focus-within:ring-2 focus-within:ring-[#D4A056]">
              <Lock className="w-5 h-5" style={{ color: "#222222" }} />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-[#D4A056] py-3 rounded-xl font-semibold text-lg transition hover:bg-white"
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
