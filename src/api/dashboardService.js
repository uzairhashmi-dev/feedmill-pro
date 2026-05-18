import API from "./axios";

// ─── INVENTORY STATS
export const fetchInventoryDailyStats   = () =>
  API.get("/inventory/stats/daily").then((r) => r.data);

export const fetchInventoryWeeklyStats  = () =>
  API.get("/inventory/stats/weekly").then((r) => r.data);

export const fetchInventoryMonthlyStats = () =>
  API.get("/inventory/stats/monthly").then((r) => r.data);

export const fetchInventoryYearlyStats  = () =>
  API.get("/inventory/stats/yearly").then((r) => r.data);

export const fetchInventoryTotalStats   = () =>
  API.get("/inventory/stats/total").then((r) => r.data);

export const fetchInventoryCustomStats  = (startDate, endDate) =>
  API.get(`/inventory/stats/custom?startDate=${startDate}&endDate=${endDate}`)
    .then((r) => r.data);

// ─── PRODUCTION STATS 
export const fetchProductionDailyStats   = () =>
  API.get("/production/stats/daily").then((r) => r.data);

export const fetchProductionWeeklyStats  = () =>
  API.get("/production/stats/weekly").then((r) => r.data);

export const fetchProductionMonthlyStats = () =>
  API.get("/production/stats/monthly").then((r) => r.data);

export const fetchProductionYearlyStats  = () =>
  API.get("/production/stats/yearly").then((r) => r.data);

export const fetchProductionTotalStats   = () =>
  API.get("/production/stats/total").then((r) => r.data);

export const fetchProductionCustomStats  = (startDate, endDate) =>
  API.get(`/production/stats/custom?startDate=${startDate}&endDate=${endDate}`)
    .then((r) => r.data);

// ─── ORDER/SALES STATs
export const fetchOrderDailyStats   = () =>
  API.get("/stats/daily").then((r) => r.data);

export const fetchOrderWeeklyStats  = () =>
  API.get("/stats/weekly").then((r) => r.data);

export const fetchOrderMonthlyStats = () =>
  API.get("/stats/monthly").then((r) => r.data);

export const fetchOrderYearlyStats  = () =>
  API.get("/stats/yearly").then((r) => r.data);

export const fetchOrderTotalStats   = () =>
  API.get("/stats/total").then((r) => r.data);

export const fetchOrderCustomStats  = (startDate, endDate) =>
  API.get(`/stats/custom?startDate=${startDate}&endDate=${endDate}`)
    .then((r) => r.data);