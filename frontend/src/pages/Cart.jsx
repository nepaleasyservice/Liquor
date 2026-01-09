import { Trash2, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  const items = cart;
  const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
  const delivery = items.length ? 150 : 0;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-[#0B0705] pt-32 pb-20 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent drop-shadow-lg">
        Your Cart
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div
          className="lg:col-span-2 bg-[#1A0E0B]/80 backdrop-blur-xl rounded-3xl p-6 
                        border border-[#D4A056]/10 shadow-[0_0_40px_rgba(212,160,86,0.15)]"
        >
          {items.length === 0 && (
            <p className="text-center text-gray-400 text-lg">
              Your cart is empty 🛒
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#0E0907]/60 rounded-2xl 
                         p-4 mb-5 border border-[#3B2519] hover:border-[#D4A056] transition-all duration-300"
            >
              <img
                src={item.image.url}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover shadow-md"
              />

              <div className="flex-1 px-4">
                <h2 className="text-lg font-bold text-white">{item.name}</h2>
                <p className="text-[#D4A056] font-semibold mt-1">
                  Rs. {Number(item.price || 0).toLocaleString()}
                </p>
              </div>

              {/* ✅ QUANTITY CONTROLS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="p-2 rounded-lg border border-[#3B2519] 
                             hover:border-[#D4A056] hover:bg-[#2C1E14] text-gray-300"
                >
                  <Minus size={18} />
                </button>

                <span className="text-lg font-semibold text-white">
                  {item.qty}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="p-2 rounded-lg border border-[#3B2519] 
                             hover:border-[#D4A056] hover:bg-[#2C1E14] text-gray-300"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* ✅ DELETE BUTTON */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-400 hover:text-red-300 hover:scale-110 transition-all"
              >
                <Trash2 size={22} />
              </button>
            </div>
          ))}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div
          className="bg-[#1A0E0B]/90 p-6 rounded-3xl border border-[#D4A056]/20 
                        shadow-[0_0_35px_rgba(212,160,86,0.15)] backdrop-blur-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-[#D4A056]">
            Order Summary
          </h2>

          <div className="space-y-4 text-gray-300 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>Rs. {delivery.toLocaleString()}</span>
            </div>

            <div
              className="flex justify-between font-extrabold text-[#f1d39f] 
                            text-xl border-t border-[#D4A056]/30 pt-4"
            >
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            disabled={!items.length}
            onClick={() => navigate("/checkout")}
            className="w-full mt-8 py-4 bg-gradient-to-r from-[#D4A056] to-[#f1d39f] 
                       text-black rounded-xl font-bold text-lg shadow-lg 
                       hover:shadow-[0_0_20px_rgba(212,160,86,0.6)] 
                       transition-all tracking-wide disabled:opacity-50"
          >
            Proceed to Checkout
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Secure checkout • Fast delivery • Trusted liquor store
          </p>
        </div>
      </div>
    </div>
  );
}
