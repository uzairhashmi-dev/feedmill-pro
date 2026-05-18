import API from "./axios";

export const fetchAllCategories = async () => {
  const res = await API.get("/category/all");
  return res.data;
};

export const createCategory = async (data) => {
  const res = await API.post("/category/create", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await API.put(`/category/update/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await API.delete(`/category/delete/${id}`);
  return res.data;
};

export const searchCategories = async (term) => {
  const res = await API.get(`/category/search?search=${encodeURIComponent(term)}`);
  return res.data;
};

export const getCategoryById = async (id) => {
  const res = await API.get(`/category/singleItem/${id}`);
  return res.data;
};