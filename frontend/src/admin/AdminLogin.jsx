import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/auth.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      const data = await adminLogin(email, password);

      login(data.user);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={submit} className="bg-[#151515] p-6 rounded-xl w-96">
        <h1 className="text-2xl mb-4 font-bold">Admin Login</h1>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <input
          className="w-full mb-3 p-3 rounded bg-black/40"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-3 rounded bg-black/40"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#D4A056] text-black p-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
