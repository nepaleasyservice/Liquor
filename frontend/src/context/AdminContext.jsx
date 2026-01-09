// AdminContext.jsx
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import api from "../services/api.js";

export const AdminContext = createContext(null);

const SHOP_LIMIT = 8;
const ADMIN_DEFAULT_LIMIT = 10;
const USERS_DEFAULT_LIMIT = 10;

const makePagination = (limit) => ({
  total: 0,
  page: 1,
  limit,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
});

const initialState = {
  adminProducts: [],
  adminPagination: makePagination(ADMIN_DEFAULT_LIMIT),

  shopProducts: [],
  shopPagination: makePagination(SHOP_LIMIT),

  loading: false,
  error: null,

  // per-scope loading
  adminLoading: false,
  shopLoading: false,

  // users
  users: [],
  usersPagination: makePagination(USERS_DEFAULT_LIMIT),
  usersLoading: false,
};

const getPid = (p) => p?._id ?? p?.id;

const keepPopulatedIfUpdatedIsId = (prevVal, nextVal) => {
  const prevIsObj = prevVal && typeof prevVal === "object";
  const nextIsId = typeof nextVal === "string" || typeof nextVal === "number";
  if (prevIsObj && nextIsId) return prevVal;
  return nextVal ?? prevVal;
};

const mergeProductPreservingPopulated = (prev, updated) => {
  if (!prev) return updated;

  return {
    ...prev,
    ...updated,
    category: keepPopulatedIfUpdatedIsId(prev.category, updated.category),
    subCategory: keepPopulatedIfUpdatedIsId(prev.subCategory, updated.subCategory),
    brand: keepPopulatedIfUpdatedIsId(prev.brand, updated.brand),
  };
};

function reducer(state, action) {
  switch (action.type) {
    case "REQ": {
      const scope = action.scope || "admin";
      return {
        ...state,
        loading: true,
        error: null,
        adminLoading: scope === "admin" ? true : state.adminLoading,
        shopLoading: scope === "shop" ? true : state.shopLoading,
      };
    }

    case "ERR":
      return {
        ...state,
        loading: false,
        adminLoading: false,
        shopLoading: false,
        usersLoading: false,
        error: action.payload || "Something went wrong",
      };

    case "CLEAR_PRODUCTS": {
      const scope = action.scope;
      if (scope === "shop") return { ...state, shopProducts: [] };
      return { ...state, adminProducts: [] };
    }

    case "SET_PRODUCTS_PAGINATED": {
      const scope = action.scope;
      const products = action.payload?.products || [];
      const pagination = action.payload?.pagination;

      if (scope === "shop") {
        return {
          ...state,
          loading: false,
          shopLoading: false,
          shopProducts: products,
          shopPagination: pagination || state.shopPagination,
        };
      }

      return {
        ...state,
        loading: false,
        adminLoading: false,
        adminProducts: products,
        adminPagination: pagination || state.adminPagination,
      };
    }

    case "ADD_PRODUCT": {
      const created = action.payload;
      return {
        ...state,
        loading: false,
        adminLoading: false,
        adminProducts: [created, ...state.adminProducts],
      };
    }

    case "UPDATE_PRODUCT": {
      const updated = action.payload;
      const updatedId = getPid(updated);

      const updateList = (list) =>
        list.map((p) => {
          if (getPid(p) !== updatedId) return p;
          return mergeProductPreservingPopulated(p, updated);
        });

      return {
        ...state,
        loading: false,
        adminLoading: false,
        shopLoading: false,
        adminProducts: updateList(state.adminProducts),
        shopProducts: updateList(state.shopProducts),
      };
    }

    case "DELETE_PRODUCT": {
      const id = String(action.payload || "");
      const filterList = (list) => list.filter((p) => String(getPid(p) || "") !== id);

      return {
        ...state,
        loading: false,
        adminLoading: false,
        shopLoading: false,
        adminProducts: filterList(state.adminProducts),
        shopProducts: filterList(state.shopProducts),
      };
    }

    // users
    case "REQ_USERS":
      return { ...state, usersLoading: true, error: null };

    case "SET_USERS_PAGINATED":
      return {
        ...state,
        usersLoading: false,
        users: action.payload?.users || [],
        usersPagination: action.payload?.pagination || state.usersPagination,
      };

    case "UPDATE_USER": {
      const updated = action.payload;
      const id = String(updated?._id || updated?.id || "");
      return {
        ...state,
        usersLoading: false,
        users: state.users.map((u) => (String(u?._id || u?.id) === id ? { ...u, ...updated } : u)),
      };
    }

    default:
      return state;
  }
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // ✅ NEW: keep last user query so pagination uses server-side search consistently
  const [userQuery, setUserQuery] = useState({
    page: 1,
    limit: USERS_DEFAULT_LIMIT,
    name: "",
  });

  // ✅ NEW: remember last admin/shop product query so we can refetch after delete
  const [productQuery, setProductQuery] = useState({
    scope: "admin",
    page: 1,
    limit: ADMIN_DEFAULT_LIMIT,
    category: "",
    subCategory: "",
    brand: "",
    featured: undefined,
    name: "",
  });

  const fetchProducts = async (params = {}) => {
    const scope = params.scope || "admin";
    if (params.clear === true) dispatch({ type: "CLEAR_PRODUCTS", scope });

    dispatch({ type: "REQ", scope });

    try {
      const qs = new URLSearchParams();

      const page = params.page || 1;
      const limit = params.limit ?? (scope === "shop" ? SHOP_LIMIT : ADMIN_DEFAULT_LIMIT);

      // ✅ store last query (so pagination + refetch after delete keeps filters)
      setProductQuery((prev) => ({
        ...prev,
        scope,
        page,
        limit,
        category: params.category ?? prev.category,
        subCategory: params.subCategory ?? prev.subCategory,
        brand: params.brand ?? prev.brand,
        featured: params.featured ?? prev.featured,
        name: params.name ?? prev.name,
      }));

      qs.set("page", String(page));
      qs.set("limit", String(limit));

      if (params.featured === true) qs.set("featured", "true");
      if (params.category) qs.set("category", params.category);
      if (params.subCategory) qs.set("subCategory", params.subCategory);
      if (params.brand) qs.set("brand", params.brand);
      if (params.name) qs.set("name", params.name);

      const url = `/products/list?${qs.toString()}`;
      const res = await api.get(url);

      const list = res?.data?.data ?? res?.data?.products ?? res?.data?.item ?? [];
      const serverPagination = res?.data?.pagination;

      const total = serverPagination?.total ?? list.length;
      const pPage = serverPagination?.page ?? page;
      const pLimit = serverPagination?.limit ?? limit;

      const totalPages = serverPagination?.totalPages ?? Math.max(1, Math.ceil(total / pLimit));

      const pagination = {
        total,
        page: pPage,
        limit: pLimit,
        totalPages,
        hasNextPage: serverPagination?.hasNextPage ?? pPage < totalPages,
        hasPrevPage: serverPagination?.hasPrevPage ?? pPage > 1,
      };

      dispatch({
        type: "SET_PRODUCTS_PAGINATED",
        scope,
        payload: { products: list, pagination },
      });

      return { ok: true, products: list, pagination };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Fetch failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  const fetchShopProducts = async ({
    page = 1,
    category,
    subCategory,
    brand,
    featured,
    name,
    clear = true,
  } = {}) => {
    return fetchProducts({
      scope: "shop",
      page,
      limit: SHOP_LIMIT,
      category,
      subCategory,
      brand,
      featured,
      name,
      clear,
    });
  };

  const fetchAdminProducts = async ({
    page = 1,
    limit = ADMIN_DEFAULT_LIMIT,
    category,
    subCategory,
    brand,
    featured,
    name,
    clear = false,
  } = {}) => {
    return fetchProducts({
      scope: "admin",
      page,
      limit,
      category,
      subCategory,
      brand,
      featured,
      name,
      clear,
    });
  };

  const createProduct = async (formData) => {
    dispatch({ type: "REQ", scope: "admin" });
    try {
      const res = await api.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = res?.data?.product ?? res?.data?.data?.product ?? res?.data;
      dispatch({ type: "ADD_PRODUCT", payload: created });

      return { ok: true, product: created };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Create failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  const updateProduct = async (id, formData) => {
    dispatch({ type: "REQ", scope: "admin" });
    try {
      const res = await api.put(`/products/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res?.data?.product ?? res?.data?.data?.product ?? res?.data;
      dispatch({ type: "UPDATE_PRODUCT", payload: updated });

      return { ok: true, product: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Update failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  const togglePublish = async (id) => {
    dispatch({ type: "REQ", scope: "admin" });
    try {
      const res = await api.post(`/products/publish/${id}`);
      const updated = res?.data?.product ?? res?.data?.data?.product ?? res?.data;

      if (updated && (updated?._id || updated?.id)) {
        dispatch({ type: "UPDATE_PRODUCT", payload: updated });
      }

      return { ok: true, product: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Publish update failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  const toggleFeatured = async (id) => {
    dispatch({ type: "REQ", scope: "admin" });
    try {
      const res = await api.post(`/products/feature/${id}`);
      const updated = res?.data?.product ?? res?.data?.data?.product ?? res?.data;

      if (updated && (updated?._id || updated?.id)) {
        dispatch({ type: "UPDATE_PRODUCT", payload: updated });
      }

      return { ok: true, product: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Featured update failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  // ✅ after delete, refetch products again (same query/filters)
  const deleteProduct = async (id) => {
    dispatch({ type: "REQ", scope: "admin" });
    try {
      const res = await api.delete(`/products/delete/${id}`);
      const ok = !!res?.data?.success;

      if (ok) {
        dispatch({ type: "DELETE_PRODUCT", payload: String(id) });

        // ✅ refetch with last known query
        const q = productQuery;
        await fetchProducts({
          scope: q.scope || "admin",
          page: q.page || 1,
          limit: q.limit ?? (q.scope === "shop" ? SHOP_LIMIT : ADMIN_DEFAULT_LIMIT),
          category: q.category || "",
          subCategory: q.subCategory || "",
          brand: q.brand || "",
          featured: q.featured,
          name: q.name || "",
          clear: true,
        });
      }

      return { ok, message: res?.data?.message || "Deleted" };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Delete failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  const fetchProductById = async (id) => {
    dispatch({ type: "REQ", scope: "admin" });
    try {
      const res = await api.get(`/products/list/${id}`);
      const product = res?.data?.product ?? res?.data?.products ?? null;

      if (product) dispatch({ type: "UPDATE_PRODUCT", payload: product });

      return { ok: true, product };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Fetch product failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/get");
      const list = res?.data?.item ?? res?.data?.categories ?? res?.data ?? [];
      setCategories(list);
    } catch (e) {
      console.error("fetchCategories error:", e);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/brand/get");
      const list = res?.data?.item ?? res?.data?.brands ?? res?.data ?? [];
      setBrands(list);
    } catch (e) {
      console.error("fetchBrands error:", e);
      setBrands([]);
    }
  };

  const fetchSubcategoriesByCategory = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const res = await api.get("/category/sub/get", { params: { categoryId } });
      const list = res?.data?.item ?? res?.data?.subcategories ?? res?.data ?? [];
      setSubcategories(list);
    } catch (e) {
      console.error("fetchSubcategoriesByCategory error:", e);
      setSubcategories([]);
    }
  };

  // ✅ SERVER-SIDE SEARCH: fetchUsers ALWAYS hits API with name param (no client filtering)
  // Also remembers last search so pagination keeps filtering on server.
  const fetchUsers = async ({ page = 1, limit = USERS_DEFAULT_LIMIT, name } = {}) => {
    const qName = typeof name === "string" ? name : userQuery.name;

    // store last query for pagination
    setUserQuery((prev) => ({
      ...prev,
      page,
      limit,
      name: qName,
    }));

    dispatch({ type: "REQ_USERS" });

    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", String(limit));
      if (qName && qName.trim()) qs.set("name", qName.trim());

      const res = await api.get(`/admin/user-list?${qs.toString()}`);

      const list = res?.data?.data ?? [];
      const serverPagination = res?.data?.pagination;

      const total = serverPagination?.total ?? list.length;
      const pPage = serverPagination?.page ?? page;
      const pLimit = serverPagination?.limit ?? limit;
      const totalPages = serverPagination?.totalPages ?? Math.max(1, Math.ceil(total / pLimit));

      const pagination = {
        total,
        page: pPage,
        limit: pLimit,
        totalPages,
        hasNextPage: serverPagination?.hasNextPage ?? pPage < totalPages,
        hasPrevPage: serverPagination?.hasPrevPage ?? pPage > 1,
      };

      dispatch({ type: "SET_USERS_PAGINATED", payload: { users: list, pagination } });
      return { ok: true, users: list, pagination };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Fetch users failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  // keep toggle as you already fixed (no stale overwrite)
  const toggleDisableUser = async (id) => {
    dispatch({ type: "REQ_USERS" });

    try {
      const res = await api.post("/admin/disable-user", { id });
      const updated = res?.data?.user;

      if (updated?._id || updated?.id) {
        dispatch({ type: "UPDATE_USER", payload: updated });
      }

      return { ok: true, user: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Disable user failed";
      dispatch({ type: "ERR", payload: msg });
      return { ok: false, message: msg };
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        products: state.adminProducts,
        pagination: state.adminPagination,

        shopProducts: state.shopProducts,
        shopPagination: state.shopPagination,

        loading: state.loading,
        error: state.error,

        adminLoading: state.adminLoading,
        shopLoading: state.shopLoading,

        categories,
        subcategories,
        brands,

        fetchProducts,
        fetchAdminProducts,
        fetchShopProducts,

        fetchProductById,
        createProduct,
        updateProduct,
        togglePublish,
        toggleFeatured,
        deleteProduct,
        fetchSubcategoriesByCategory,
        fetchBrands,
        fetchCategories,

        SHOP_LIMIT,
        ADMIN_DEFAULT_LIMIT,

        users: state.users,
        usersPagination: state.usersPagination,
        usersLoading: state.usersLoading,
        fetchUsers,
        toggleDisableUser,
        USERS_DEFAULT_LIMIT,

        // optional: expose current server-side search term (if you want)
        userQuery,

        // optional: expose current product query too
        productQuery,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider />");
  return ctx;
};
