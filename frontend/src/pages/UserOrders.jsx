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
      <div className="min-h-screen bg-white pt-32 text-center" style={{ color: "#222222" }}>
        Loading your orders…
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-32 px-6" style={{ color: "#222222" }}>
        <div className="max-w-xl mx-auto p-4 bg-white border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-white pt-32 text-center" style={{ color: "#222222" }}>
        No orders found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6" style={{ color: "#222222" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#D4A056] to-[#f1d39f] bg-clip-text text-transparent">
            My Orders
          </h2>
        </div>

        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o._id || o.orderId}
              className="rounded-3xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div>
                  <div className="text-sm" style={{ color: "#222222" }}>
                    Order ID
                  </div>
                  <div className="font-semibold text-[#B8852E]">#{o.orderId}</div>

                  <div className="flex flex-wrap gap-3 mt-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-white border border-gray-200" style={{ color: "#222222" }}>
                      Payment: {o.paymentMethod}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full border ${
                        o.paymentStatus === "Completed"
                          ? "border-green-300 text-green-700 bg-white"
                          : "border-yellow-300 text-yellow-800 bg-white"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </div>

                  <div className="text-xs mt-2" style={{ color: "#222222" }}>
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm" style={{ color: "#222222" }}>
                    Total
                  </div>
                  <div className="text-2xl font-extrabold text-[#B8852E]">
                    {money(o.total)}
                  </div>
                  <div className="text-xs" style={{ color: "#222222" }}>
                    {money(o.subtotal)} + Delivery {money(o.deliveryFee)}
                  </div>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              <div>
                <div className="font-semibold mb-3 text-[#B8852E]">Items</div>
                <div className="space-y-2">
                  {(o.items || []).map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm" style={{ color: "#222222" }}>
                      <span>
                        {(it.name || it.product?.name || "Item")} × {(it.qty || it.quantity || 1)}
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
