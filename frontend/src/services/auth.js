import api from "./api";
export const adminLogin = async (email, password) => {
  const res = await api.post("/auth/admin/login", {
    email,
    password,
  });

  return res.data;
};

export const adminLogout = async () => {
  await api.post("/auth/admin/logout");
  window.location.href = "/admin/login";
};
