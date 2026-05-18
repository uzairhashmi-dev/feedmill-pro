import API from "./axios";

// Customers = order data se nikalta hai
// Koi alag customer endpoint nahi hai backend mein
// Isliye order endpoints use karte hain

export const fetchAllOrdersForCustomers = async () => {
  const res = await API.get("/order/all");
  return res.data;
};

export const fetchOrderMonthlyStatsForCustomers = async () => {
  const res = await API.get("/order/MonthlyStats");
  return res.data;
};

export const searchOrdersByCustomer = async (term) => {
  const res = await API.get(
    `/order/search?search=${encodeURIComponent(term)}`
  );
  return res.data;
};