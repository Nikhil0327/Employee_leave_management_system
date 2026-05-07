import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://employee-leave-management-system-backend-h7ke.onrender.com";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("leave.auth");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch {
      return config;
    }
  }
  return config;
});

export default api;
