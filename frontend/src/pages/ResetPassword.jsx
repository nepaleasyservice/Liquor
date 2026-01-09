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
    <div className="min-h-screen flex items-center justify-center bg-[#0B0705] px-4 pt-28 pb-16 bg-[url('/whiskey-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative bg-[#1A0E0B]/80 border border-[#D4A056]/30 rounded-3xl shadow-[0_0_40px_rgba(212,160,86,0.25)] p-10 w-full max-w-md backdrop-blur-xl animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-wide bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent">
          Reset Password
        </h1>

        {msg && !error && <p className="text-green-400 text-center mb-4">{msg}</p>}
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="text-gray-300 mb-1 block">New Password</label>
            <div className="flex items-center bg-[#0E0907] rounded-xl border border-[#3B2519] px-4">
              <Lock className="text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent py-3 px-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 mb-1 block">Confirm Password</label>
            <div className="flex items-center bg-[#0E0907] rounded-xl border border-[#3B2519] px-4">
              <Lock className="text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent py-3 px-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black py-3 rounded-xl font-semibold text-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-[#D4A056]/40 text-[#D4A056] py-3 rounded-xl font-semibold text-lg hover:bg-[#D4A056]/10 transition"
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
