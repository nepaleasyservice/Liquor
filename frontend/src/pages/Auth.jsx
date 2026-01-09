// src/pages/Auth.jsx
import { useContext, useEffect, useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Auth() {
  const [active, setActive] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  // ✅ verification UI state
  const [verifiedMsg, setVerifiedMsg] = useState(""); // "", "success", "fail"

  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useContext(UserContext);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ detect /login?verified=true or /login?verified=false
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("verified");
    if (v === "true") setVerifiedMsg("success");
    else if (v === "false") setVerifiedMsg("fail");
    else setVerifiedMsg("");
  }, [location.search]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setText("");
    setLoading(true);

    try {
      await login(loginData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setText("");
    setLoading(true);

    try {
      const res = await signup(signupData);

      setSignupData({ name: "", email: "", password: "" });

      setActive("login");
      setText(res?.message || "Signup successful. Please verify email.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ "Login here" button action: show login tab and remove query
  const handleLoginHere = () => {
    setVerifiedMsg("");
    setError("");
    setText("");
    setActive("login");
    navigate("/login", { replace: true }); // removes ?verified=true
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0705] px-4 pt-28 pb-16 bg-[url('/whiskey-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative bg-[#1A0E0B]/80 border border-[#D4A056]/30 rounded-3xl shadow-[0_0_40px_rgba(212,160,86,0.25)] p-10 w-full max-w-md backdrop-blur-xl animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent">
          LiquorStore
        </h1>

        {/* ✅ VERIFIED UI */}
        {verifiedMsg && (
          <div className="animate-slideUp text-center">
            {verifiedMsg === "success" ? (
              <>
                <p className="text-green-400 text-xl font-semibold mb-3">
                  ✅ User Verified Successfully
                </p>
                <p className="text-gray-200 mb-6">
                  Your account has been verified. You can login now.
                </p>
                <button
                  onClick={handleLoginHere}
                  className="w-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black py-3 rounded-xl font-semibold text-lg"
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                <p className="text-red-400 text-xl font-semibold mb-3">
                  ❌ Verification Failed
                </p>
                <p className="text-gray-200 mb-6">
                  Verification link is invalid or expired.
                </p>
                <button
                  onClick={handleLoginHere}
                  className="w-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black py-3 rounded-xl font-semibold text-lg"
                >
                  Go to Login
                </button>
              </>
            )}
          </div>
        )}

        {/* ✅ Normal login/signup UI only when not showing verified */}
        {!verifiedMsg && (
          <>
            <div className="flex mb-8 bg-[#0C0806]/60 rounded-2xl p-1 border border-[#D4A056]/20">
              <button
                onClick={() => setActive("login")}
                className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  active === "login"
                    ? "bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black shadow-md"
                    : "text-gray-300 hover:bg-[#2C1E14]"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActive("signup")}
                className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  active === "signup"
                    ? "bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black shadow-md"
                    : "text-gray-300 hover:bg-[#2C1E14]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {text && !error && (
              <p className="text-green-400 text-center mb-4">{text}</p>
            )}
            {error && <p className="text-red-400 text-center mb-4">{error}</p>}

            {/* ---------------- LOGIN ---------------- */}
            {active === "login" && (
              <form
                className="space-y-6 animate-slideUp"
                onSubmit={handleLoginSubmit}
              >
                <div className="group">
                  <label className="text-gray-300 mb-1 block">Email</label>
                  <div className="flex items-center bg-[#0E0907] rounded-xl border border-[#3B2519] px-4">
                    <Mail className="text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="you@example.com"
                      className="w-full bg-transparent py-3 px-3 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-300 mb-1 block">Password</label>
                  <div className="flex items-center bg-[#0E0907] rounded-xl border border-[#3B2519] px-4">
                    <Lock className="text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      className="w-full bg-transparent py-3 px-3 text-white focus:outline-none"
                    />
                  </div>

                  {/* ✅ Forgot password button */}
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm text-[#D4A056] hover:text-[#f1d39f] transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black py-3 rounded-xl font-semibold text-lg"
                >
                  {loading ? "Please wait..." : "Login"}
                </button>
              </form>
            )}

            {/* ---------------- SIGNUP ---------------- */}
            {active === "signup" && (
              <form
                className="space-y-6 animate-slideUp"
                onSubmit={handleSignupSubmit}
              >
                <div className="group">
                  <label className="text-gray-300 mb-1 block">Full Name</label>
                  <div className="flex items-center bg-[#0E0907] rounded-xl border border-[#3B2519] px-4">
                    <User className="text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      placeholder="Your full name"
                      className="w-full bg-transparent py-3 px-3 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-300 mb-1 block">Email</label>
                  <div className="flex items-center bg-[#0E0907] rounded-xl border border-[#3B2519] px-4">
                    <Mail className="text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="you@example.com"
                      className="w-full bg-transparent py-3 px-3 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-300 mb-1 block">Password</label>
                  <div className="flex items-center bg-[#0E0907] rounded-xl border border-[#3B2519] px-4">
                    <Lock className="text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Create a password"
                      className="w-full bg-transparent py-3 px-3 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black py-3 rounded-xl font-semibold text-lg"
                >
                  {loading ? "Please wait..." : "Create Account"}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease forwards; }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
