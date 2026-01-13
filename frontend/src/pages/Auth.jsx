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

  const handleLoginHere = () => {
    setVerifiedMsg("");
    setError("");
    setText("");
    setActive("login");
    navigate("/login", { replace: true });
  };

  const inputWrap =
    "flex items-center bg-white rounded-xl border border-gray-300 px-4 focus-within:ring-2 focus-within:ring-[#D4A056]";

  const inputField =
    "w-full bg-transparent py-3 px-3 focus:outline-none";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white px-4 pt-28 pb-16"
      style={{ color: "#222222" }}
    >
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-md animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent">
          LiquorStore
        </h1>

        {/* VERIFIED UI */}
        {verifiedMsg && (
          <div className="animate-slideUp text-center">
            {verifiedMsg === "success" ? (
              <>
                <p className="text-green-700 text-xl font-semibold mb-3">
                  ✅ User Verified Successfully
                </p>
                <p className="mb-6">Your account has been verified. You can login now.</p>
                <button
                  onClick={handleLoginHere}
                  className="w-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition"
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                <p className="text-red-600 text-xl font-semibold mb-3">
                  ❌ Verification Failed
                </p>
                <p className="mb-6">Verification link is invalid or expired.</p>
                <button
                  onClick={handleLoginHere}
                  className="w-full bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition"
                >
                  Go to Login
                </button>
              </>
            )}
          </div>
        )}

        {/* Normal login/signup UI */}
        {!verifiedMsg && (
          <>
            <div className="flex mb-8 bg-white rounded-2xl p-1 border border-gray-200">
              <button
                onClick={() => setActive("login")}
                className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  active === "login"
                    ? "bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black shadow-sm"
                    : "text-[#222222] hover:bg-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActive("signup")}
                className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  active === "signup"
                    ? "bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black shadow-sm"
                    : "text-[#222222] hover:bg-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {text && !error && (
              <p className="text-green-700 text-center mb-4">{text}</p>
            )}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            {/* LOGIN */}
            {active === "login" && (
              <form className="space-y-6 animate-slideUp" onSubmit={handleLoginSubmit}>
                <div className="group">
                  <label className="mb-1 block">Email</label>
                  <div className={inputWrap}>
                    <Mail className="w-5 h-5" style={{ color: "#222222" }} />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="you@example.com"
                      className={inputField}
                      style={{ color: "#222222" }}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-1 block">Password</label>
                  <div className={inputWrap}>
                    <Lock className="w-5 h-5" style={{ color: "#222222" }} />
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      className={inputField}
                      style={{ color: "#222222" }}
                    />
                  </div>

                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm text-[#B8852E] hover:text-[#D4A056] transition"
                    >
                      Forgot password?
                    </button>
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
                  {loading ? "Please wait..." : "Login"}
                </button>
              </form>
            )}

            {/* SIGNUP */}
            {active === "signup" && (
              <form className="space-y-6 animate-slideUp" onSubmit={handleSignupSubmit}>
                <div className="group">
                  <label className="mb-1 block">Full Name</label>
                  <div className={inputWrap}>
                    <User className="w-5 h-5" style={{ color: "#222222" }} />
                    <input
                      type="text"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      placeholder="Your full name"
                      className={inputField}
                      style={{ color: "#222222" }}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-1 block">Email</label>
                  <div className={inputWrap}>
                    <Mail className="w-5 h-5" style={{ color: "#222222" }} />
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="you@example.com"
                      className={inputField}
                      style={{ color: "#222222" }}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="mb-1 block">Password</label>
                  <div className={inputWrap}>
                    <Lock className="w-5 h-5" style={{ color: "#222222" }} />
                    <input
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Create a password"
                      className={inputField}
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
