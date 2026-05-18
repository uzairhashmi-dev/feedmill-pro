import API from "./axios";

export const fetchAllOrders = async () => {
  const res = await API.get("/order/all");
  return res.data;
};

export const fetchOrderMonthlyStats = async () => {
  const res = await API.get("/order/MonthlyStats");
  return res.data;
};

export const fetchOrderTotalStats = async () => {
  const res = await API.get("/order/getTotalStats");
  return res.data;
};

export const fetchFormulaStockSummary = async () => {
  const res = await API.get("/order/getFormulaStockSummary");
  return res.data;
};

export const createOrder = async (data) => {
  const res = await API.post("/order/create", data);
  return res.data;
};

export const updateOrder = async (id, data) => {
  const res = await API.put(`/order/update/${id}`, data);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await API.delete(`/order/delete/${id}`);
  return res.data;
};

export const searchOrders = async (term) => {
  const res = await API.get(
    `/order/search?search=${encodeURIComponent(term)}`
  );
  return res.data;
};