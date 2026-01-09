import api from "./api";

export const handleEnjoyCreate = async (form) => {
    const res = await api.post("/enjoy/create", form);
    return res.data;
};