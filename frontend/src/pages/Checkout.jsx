import { useMemo, useState } from "react";
import { Truck, ShieldCheck, Gift } from "lucide-react";
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

  const [error, setError] = useState("");

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.qty, 0),
    [items]
  );

  const deliveryFee = items.length ? 150 : 0;
  const total = subtotal + deliveryFee;

  const isBillingValid = useMemo(() => {
    return billing.fullName.trim() && billing.email.trim() && billing.phone.trim();
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

    if (!items.length) return setError("Your cart is empty.");
    if (!isBillingValid)
      return setError("Please complete all required Billing Details (Name, Email, Phone).");
    if (!isAddressValid)
      return setError("Please complete all required Delivery Address fields.");

    setError("");

    navigate("/payment", {
      state: { billing, address, subtotal, deliveryFee, total },
    });
  };

  const inputClass =
    "bg-white border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4A056] transition";

  return (
    <form
      onSubmit={submitCheckout}
      className="min-h-screen bg-white pt-28 pb-20 px-4 md:px-8"
      style={{ color: "#222222" }}
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
        <div className="lg:col-span-2 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 text-[#B8852E] text-xl font-bold">
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
                className={inputClass}
                placeholder="Full Name"
                required
                style={{ color: "#222222" }}
              />
              <input
                name="email"
                type="email"
                value={billing.email}
                onChange={handleBillingChange}
                className={inputClass}
                placeholder="Email Address"
                required
                style={{ color: "#222222" }}
              />
              <input
                name="phone"
                value={billing.phone}
                onChange={handleBillingChange}
                className={inputClass}
                placeholder="Phone Number"
                required
                style={{ color: "#222222" }}
              />
              <input
                name="altPhone"
                value={billing.altPhone}
                onChange={handleBillingChange}
                className={inputClass}
                placeholder="Alternate Phone (optional)"
                style={{ color: "#222222" }}
              />
            </div>

            {!isBillingValid && (
              <p className="mt-4 text-xs" style={{ color: "#222222" }}>
                * Name, Email and Phone are required.
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 text-[#B8852E] text-xl font-bold">
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
                className={inputClass}
                placeholder="Street Address"
                required
                style={{ color: "#222222" }}
              />
              <input
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                className={inputClass}
                placeholder="City"
                required
                style={{ color: "#222222" }}
              />
              <input
                name="province"
                value={address.province}
                onChange={handleAddressChange}
                className={inputClass}
                placeholder="Province / State"
                required
                style={{ color: "#222222" }}
              />
              <input
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
                className={inputClass}
                placeholder="Postal Code"
                required
                style={{ color: "#222222" }}
              />
            </div>

            {!isAddressValid && (
              <p className="mt-4 text-xs" style={{ color: "#222222" }}>
                * All delivery address fields are required.
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "#222222" }}>
            <ShieldCheck className="text-[#D4A056]" /> Order Summary
          </h2>

          {items.length === 0 ? (
            <p className="text-center">Your cart is empty</p>
          ) : (
            <div className="space-y-3 text-sm" style={{ color: "#222222" }}>
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

          <hr className="my-5 border-gray-200" />

          <div className="space-y-2 text-md">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee}</span>
            </div>

            <div className="flex justify-between text-xl font-black border-t border-gray-200 pt-3 mt-3">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}

          <motion.button
            type="submit"
            disabled={!canProceed}
            whileHover={{ scale: canProceed ? 1.03 : 1 }}
            className={`w-full py-4 mt-4 rounded-xl font-bold text-lg shadow-md transition-all duration-300 ${
              !canProceed
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D4A056] via-[#f1d39f] to-[#D4A056] text-black hover:shadow-lg"
            }`}
          >
            Complete Purchase
          </motion.button>

          <p className="text-xs text-center mt-4" style={{ color: "#222222" }}>
            Encrypted Transaction • Zero Data Stored • Verified Checkout
          </p>
        </motion.div>
      </div>
    </form>
  );
}
