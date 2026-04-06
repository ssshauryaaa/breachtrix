import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Attach JWT from cookie automatically (cookies are sent via withCredentials).
// This interceptor also supports Authorization header for any legacy usage.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
