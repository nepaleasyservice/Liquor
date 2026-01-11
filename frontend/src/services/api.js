import axios from "axios";

const api = axios.create({
  // baseURL: "/api",          // ✅ same-origin (frontend domain)
    baseURL: import.meta.env.VITE_API_URL + "/api",

  withCredentials: true,    // ✅ required for cookies
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isAdminRoute = path.startsWith("/admin");
      const isAdminLogin = path === "/admin/login";

      if (isAdminRoute && !isAdminLogin) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
