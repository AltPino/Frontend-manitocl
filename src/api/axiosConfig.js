import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // cambia si tu backend corre en otro puerto
});

// Si hay token guardado, lo agrega automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
