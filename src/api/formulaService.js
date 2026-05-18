import API from "./axios";

export const fetchAllFormulas = async () => {
  const res = await API.get("/formula/all");
  return res.data;
};

export const createFormula = async (data) => {
  const res = await API.post("/formula/create", data);
  return res.data;
};

export const updateFormula = async (id, data) => {
  const res = await API.put(`/formula/update/${id}`, data);
  return res.data;
};

export const deleteFormula = async (id) => {
  const res = await API.delete(`/formula/delete/${id}`);
  return res.data;
};

export const getFormulaById = async (id) => {
  const res = await API.get(`/formula/${id}`);
  return res.data;
};

export const searchFormulas = async (term) => {
  const res = await API.get(`/formula/search?search=${encodeURIComponent(term)}`);
  return res.data;
};

export const fetchCategoriesForFormula = async () => {
  const res = await API.get("/category/all");
  return res.data;
};

export const fetchInventoryForFormula = async () => {
  const res = await API.get("/inventory/get");
  return res.data;
};