import api from "./api";

export const fetchOrders = async (paymentStatus) => {
  const res = await api.get("/orders/get-admin-orders", {
    params: paymentStatus ? { paymentStatus } : {},
  });
  return res.data;
};
