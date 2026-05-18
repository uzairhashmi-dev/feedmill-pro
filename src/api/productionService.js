import API from "./axios";

export const fetchAllProductions = async () => {
  const res = await API.get("/production/all");
  return res.data;
};

export const createProduction = async (data) => {
  const res = await API.post("/production/create", data);
  return res.data;
};

export const updateProduction = async (id, data) => {
  const res = await API.put(`/production/update/${id}`, data);
  return res.data;
};

export const deleteProduction = async (id) => {
  const res = await API.delete(`/production/delete/${id}`);
  return res.data;
};

export const searchProductions = async (term) => {
  const res = await API.get(`/production/search?search=${encodeURIComponent(term)}`);
  return res.data;
};

export const getProductionById = async (id) => {
  const res = await API.get(`/production/${id}`);
  return res.data;
};

export const fetchFormulasForProduction = async () => {
  const res = await API.get("/formula/all");
  return res.data;
};