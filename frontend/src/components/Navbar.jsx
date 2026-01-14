import { Menu, X, ChevronDown } from "lucide-react";
import { useContext, useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { UserContext } from "../context/UserContext";

const PremiumCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor" className="w-7 h-7">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l3.6 12.59a2 2 0 001.92 1.41H19a2 2 0 001.92-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PremiumUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 21a8 8 0 1112 0H6z" />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { cart } = useCart();
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(UserContext);

  const firstLetter = useMemo(() => {
    const n = user?.name?.trim();
    return n ? n[0].toUpperCase() : "U";
  }, [user]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    setOpen(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="w-full fixed top-0 z-50 bg-white border-b border-gray-200 shadow-sm" style={{ color: "#222222" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group select-none">
          <img src="/liquorlogo.png" className="h-11 sm:h-12 transition-all duration-500" alt="logo" />
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-[#D4A056] via-[#b98c45] to-[#8C6121] text-transparent bg-clip-text">
            Imperial Liquor
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-10 font-medium text-lg">
          {[
            { to: "/about", label: "About" },
            { to: "/products", label: "Liquors" },
            { to: "/shop", label: "Shops" },
            { to: "/offers", label: "Offers" },
            { to: "/contact", label: "Contact" },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="relative group" style={{ color: "#222222" }}>
              <span className="group-hover:text-[#B8852E] transition duration-300">{item.label}</span>
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-[#F7E7B4] to-[#D4A056] group-hover:w-full transition-all duration-500 rounded-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            <div
              onClick={() => navigate("/auth")}
              className="cursor-pointer transition duration-300 hover:scale-110"
              style={{ color: "#222222" }}
              title="Login"
            >
              <PremiumUserIcon />
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 transition"
                title="Account"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#F7E7B4] to-[#D4A056] text-black font-extrabold flex items-center justify-center">
                  {firstLetter}
                </div>
                <ChevronDown className="w-4 h-4" style={{ color: "#222222" }} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="text-sm font-semibold truncate" style={{ color: "#222222" }}>
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs truncate" style={{ color: "#222222" }}>
                      {user?.email || ""}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/orders");
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-white"
                    style={{ color: "#222222" }}
                  >
                    Orders
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm"
                    style={{ color: "#cc0000" }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link to="/cart" className="relative transition duration-300 hover:scale-110" style={{ color: "#222222" }}>
            <PremiumCartIcon />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D4A056] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {totalQty}
              </span>
            )}
          </Link>

          <Menu className="md:hidden w-8 h-8 transition duration-300" style={{ color: "#222222" }} onClick={() => setOpen(true)} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex">
          {/* No dim opacity overlay: solid white */}
          <div className="flex-1 bg-white" onClick={() => setOpen(false)} />

          <div className="w-80 h-full bg-white shadow-xl p-8 relative rounded-l-3xl border-l border-gray-200 animate-slideIn">
            <X
              className="absolute top-6 right-6 w-7 h-7 cursor-pointer transition duration-300"
              style={{ color: "#222222" }}
              onClick={() => setOpen(false)}
            />

            <div className="mt-16 flex flex-col gap-8 text-[20px] font-semibold" style={{ color: "#222222" }}>
              {[
                { to: "/about", label: "About" },
                { to: "/products", label: "Liquors" },
                { to: "/shop", label: "Shops" },
                { to: "/offers", label: "Offers" },
                { to: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="transition-all duration-300 hover:text-[#B8852E]"
                >
                  {item.label}
                </Link>
              ))}

              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/auth");
                  }}
                  className="text-left transition-all duration-300 hover:text-[#B8852E]"
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="text-left transition-all duration-300"
                    style={{ color: "#cc0000" }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </nav>
  );
}
