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
    <div className="min-h-screen bg-white pt-32 pb-20 px-6" style={{ color: "#222222" }}>
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent">
        Your Cart
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          {items.length === 0 && (
            <p className="text-center text-lg">Your cart is empty 🛒</p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white rounded-2xl p-4 mb-5 border border-gray-200 hover:border-[#D4A056] transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-200"
              />

              <div className="flex-1 px-4">
                <h2 className="text-lg font-bold" style={{ color: "#222222" }}>
                  {item.name}
                </h2>
                <p className="text-[#D4A056] font-semibold mt-1">
                  Rs. {Number(item.price || 0).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="p-2 rounded-lg border border-gray-300 hover:border-[#D4A056] hover:bg-[#F7E7B4] transition"
                  style={{ color: "#222222" }}
                >
                  <Minus size={18} />
                </button>

                <span className="text-lg font-semibold" style={{ color: "#222222" }}>
                  {item.qty}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="p-2 rounded-lg border border-gray-300 hover:border-[#D4A056] hover:bg-[#F7E7B4] transition"
                  style={{ color: "#222222" }}
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 transition-all hover:scale-110"
                style={{ color: "#cc0000" }}
              >
                <Trash2 size={22} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-[#D4A056]">
            Order Summary
          </h2>

          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>Rs. {delivery.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-extrabold text-xl border-t border-gray-200 pt-4">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            disabled={!items.length}
            onClick={() => navigate("/checkout")}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg shadow-md transition-all tracking-wide ${
              !items.length
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D4A056] to-[#f1d39f] text-black hover:shadow-lg"
            }`}
          >
            Proceed to Checkout
          </button>

          <p className="text-center text-sm mt-4" style={{ color: "#222222" }}>
            Secure checkout • Fast delivery • Trusted liquor store
          </p>
        </div>
      </div>
    </div>
  );
}
