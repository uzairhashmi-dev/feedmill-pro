import API from "./axios";

export const fetchProfile = async () => {
  const res = await API.get("/setting/getProfile");
  return res.data;
};

export const updateProfileApi = async (formData) => {
  const res = await API.post("/setting/updateProfile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    // multipart/form-data = file upload ke liye zaruri
  });
  return res.data;
};

export const changePasswordApi = async (data) => {
  const res = await API.post("/setting/changePassword", data);
  return res.data;
};