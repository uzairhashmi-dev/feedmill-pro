import API from "./axios";

export const fetchAllInventory = async () => {
  const res = await API.get("/inventory/get");
  return res.data;
};

export const fetchMonthlyStats = async () => {
  const res = await API.get("/inventory/MonthlyStats");
  return res.data;
};

export const fetchTotalStats = async () => {
  const res = await API.get("/inventory/getTotalStats");
  return res.data;
};

export const createInventory = async (data) => {
  const res = await API.post("/inventory/create", data);
  return res.data;
};

export const updateInventory = async (id, data) => {
  const res = await API.put(`/inventory/update/${id}`, data);
  return res.data;
};

export const deleteInventory = async (id) => {
  const res = await API.delete(`/inventory/delete/${id}`);
  return res.data;
};

export const searchInventory = async (term) => {
  const res = await API.get(`/inventory/search?search=${encodeURIComponent(term)}`);
  return res.data;
};

export const fetchFilteredOrders = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
  const res = await API.get(`/inventory/filtered?${params}`);
  return res.data;
};