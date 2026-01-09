import React, { useEffect } from "react";
import { useOrders } from "../context/OrderContext";

const money = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

const UserOrders = () => {
  const { orders, loading, error, fetchUserOrders } = useOrders();

  useEffect(() => {
    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0B0705] pt-32 text-center text-gray-400">
        Loading your orders…
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0705] pt-32 px-6">
        <div className="max-w-xl mx-auto p-4 bg-red-900/20 border border-red-500/30 text-red-300 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-[#0B0705] pt-32 text-center text-gray-400">
        No orders found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0705] pt-28 pb-20 px-6 text-white">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2
            className="text-3xl font-extrabold bg-gradient-to-r
            from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent"
          >
            My Orders
          </h2>

          
        </div>

        {/* ORDERS */}
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o._id || o.orderId}
              className="rounded-3xl p-6
              bg-[#1A0E0B]/70 backdrop-blur-xl
              border border-[#D4A056]/20
              shadow-[0_0_40px_rgba(212,160,86,0.15)]"
            >
              {/* TOP */}
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div>
                  <div className="text-sm text-gray-400">Order ID</div>
                  <div className="font-semibold text-[#F5DA9C]">
                    #{o.orderId}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10">
                      Payment: {o.paymentMethod}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full border
                      ${
                        o.paymentStatus === "Completed"
                          ? "border-green-400 text-green-400"
                          : "border-yellow-400 text-yellow-400"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400">Total</div>
                  <div className="text-2xl font-extrabold text-[#D4A056]">
                    {money(o.total)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {money(o.subtotal)} + Delivery {money(o.deliveryFee)}
                  </div>
                </div>
              </div>

              <hr className="my-6 border-white/10" />

              {/* ITEMS */}
              <div>
                <div className="font-semibold mb-3 text-[#F5DA9C]">Items</div>
                <div className="space-y-2">
                  {(o.items || []).map((it, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-300"
                    >
                      <span>
                        {(it.name || it.product?.name || "Item")} ×{" "}
                        {(it.qty || it.quantity || 1)}
                      </span>
                      <span>{money(it.price || it.product?.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
