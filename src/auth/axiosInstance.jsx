
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.5:8082", 
});

// Optional: Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {    // Example: Attach token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export default axiosInstance;