import axios from "axios";

// Automatically switch between local and production API
const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000" // 👈 Local backend (development)
      : "https://expense-tracker-fastapi-s222.onrender.com", // 👈 Deployed backend (Render)
  withCredentials: false,
});

// Attach Authorization header if token exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
