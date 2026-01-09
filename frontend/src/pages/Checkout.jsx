import { useMemo, useState } from "react";
import {
  CreditCard,
  Wallet,
  Truck,
  MapPin,
  ShieldCheck,
  Gift,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, user } = useCart();
  const items = cart;

  const [billing, setBilling] = useState({
    fullName: user.name,
    email: user.email,
    phone: "",
    altPhone: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });

  // const [paymentMethod, setPaymentMethod] = useState("CARD"); // "CARD" | "COD"
  const [error, setError] = useState("");

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.qty, 0),
    [items]
  );
  const deliveryFee = items.length ? 150 : 0;
  const total = subtotal + deliveryFee;

  const isBillingValid = useMemo(() => {
    return (
      billing.fullName.trim() && billing.email.trim() && billing.phone.trim()
    );
  }, [billing]);

  const isAddressValid = useMemo(() => {
    return (
      address.street.trim() &&
      address.city.trim() &&
      address.province.trim() &&
      address.postalCode.trim()
    );
  }, [address]);

  const canProceed = useMemo(() => {
    return items.length > 0 && isBillingValid && isAddressValid;
  }, [items.length, isBillingValid, isAddressValid]);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));

    if (error) setError("");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));

    if (error) setError("");
  };

  const submitCheckout = (e) => {
    e.preventDefault();

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!isBillingValid) {
      setError(
        "Please complete all required Billing Details (Name, Email, Phone)."
      );
      return;
    }

    if (!isAddressValid) {
      setError("Please complete all required Delivery Address fields.");
      return;
    }

    setError("");

    navigate("/payment", {
      state: {
        billing,
        address,
        // paymentMethod,
        subtotal,
        deliveryFee,
        total,
      },
    });
  };

  return (
    <form
      onSubmit={submitCheckout}
      className="min-h-screen bg-[#0B0705] pt-28 pb-20 px-4 md:px-8 text-white"
    >
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-14 tracking-widest
        bg-gradient-to-r from-[#D4A056] via-[#F5DA9C] to-[#D4A056] bg-clip-text text-transparent"
      >
        SECURE CHECKOUT
      </motion.h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-10">
          {/* BILLING */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 * 0.12 }}
            viewport={{ once: true }}
            className="bg-[#100907]/90 border border-[#2E1E13] rounded-2xl p-6 md:p-8
            backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 mb-6 text-[#F5DA9C] text-xl font-bold">
              <span className="text-[#D4A056]">
                <Gift />
              </span>
              Billing Details
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="fullName"
                value={billing.fullName}
                onChange={handleBillingChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="Full Name"
                required
              />

              <input
                name="email"
                type="email"
                value={billing.email}
                onChange={handleBillingChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="Email Address"
                required
              />

              <input
                name="phone"
                value={billing.phone}
                onChange={handleBillingChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="Phone Number"
                required
              />

              <input
                name="altPhone"
                value={billing.altPhone}
                onChange={handleBillingChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="Alternate Phone (optional)"
              />
            </div>

            {!isBillingValid && (
              <p className="mt-4 text-xs text-yellow-300">
                * Name, Email and Phone are required.
              </p>
            )}
          </motion.div>

          {/* DELIVERY ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 * 0.12 }}
            viewport={{ once: true }}
            className="bg-[#100907]/90 border border-[#2E1E13] rounded-2xl p-6 md:p-8
            backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 mb-6 text-[#F5DA9C] text-xl font-bold">
              <span className="text-[#D4A056]">
                <Truck />
              </span>
              Delivery Address
            </div>

            <div className="grid grid-cols-1 gap-4">
              <input
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="Street Address"
                required
              />

              <input
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="City"
                required
              />

              <input
                name="province"
                value={address.province}
                onChange={handleAddressChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="Province / State"
                required
              />

              <input
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
                className="bg-[#120B08] border border-[#3B2618] rounded-xl px-5 py-3
                text-white placeholder-[#C2A46D] focus:outline-none focus:ring-2
                focus:ring-[#D4A056]/40 transition"
                placeholder="Postal Code"
                required
              />
            </div>

            {!isAddressValid && (
              <p className="mt-4 text-xs text-yellow-300">
                * All delivery address fields are required.
              </p>
            )}
          </motion.div>

          {/* PAYMENT METHOD */}
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 2 * 0.12 }}
            viewport={{ once: true }}
            className="bg-[#100907]/90 border border-[#2E1E13] rounded-2xl p-6 md:p-8
            backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 mb-6 text-[#F5DA9C] text-xl font-bold">
              <span className="text-[#D4A056]">
                <Wallet />
              </span>
              Payment Method
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label
                className="flex items-center gap-4 bg-[#120B08] border border-[#3B2618]
                rounded-xl p-4 cursor-pointer hover:border-[#D4A056]
                hover:bg-[#1A120F] transition"
              >
                <input
                  type="radio"
                  name="payment"
                  className="hidden"
                  checked={paymentMethod === "CARD"}
                  onChange={() => setPaymentMethod("CARD")}
                />
                <span className="text-[#D4A056]">
                  <CreditCard />
                </span>
                <span className="font-semibold tracking-wide">
                  Card Payment
                </span>
              </label>

              <label
                className="flex items-center gap-4 bg-[#120B08] border border-[#3B2618]
                rounded-xl p-4 cursor-pointer hover:border-[#D4A056]
                hover:bg-[#1A120F] transition"
              >
                <input
                  type="radio"
                  name="payment"
                  className="hidden"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span className="text-[#D4A056]">
                  <MapPin />
                </span>
                <span className="font-semibold tracking-wide">
                  Cash on Delivery
                </span>
              </label>
            </div>
          </motion.div> */}
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#100907] border border-[#3B2618] rounded-3xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2
            text-[#F5DA9C]"
          >
            <ShieldCheck className="text-[#D4A056]" /> Order Summary
          </h2>

          {items.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-3 text-sm text-[#EAD7AA]">
              {items.map((item) => (
                <div key={item.id || item._id} className="flex justify-between">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>Rs. {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <hr className="my-5 opacity-30" />

          <div className="space-y-2 text-md">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee}</span>
            </div>

            <div
              className="flex justify-between text-xl font-black
              text-[#F5DA9C] border-t border-[#3B2618] pt-3 mt-3"
            >
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center mt-4">{error}</p>
          )}

          {/* BUTTON */}
          <motion.button
            type="submit"
            disabled={!canProceed}
            whileHover={{ scale: canProceed ? 1.05 : 1 }}
            className="w-full py-4 mt-4 rounded-xl font-bold text-lg text-black 
              bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-[#D4A056] 
              bg-[length:200%_200%] animate-goldShimmer 
              shadow-lg shadow-[#D4A056]/40 
              disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500"
          >
            Complete Purchase
          </motion.button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Encrypted Transaction • Zero Data Stored • Verified Checkout
          </p>
        </motion.div>
      </div>
    </form>
  );
}
