import axios from "axios";

// You can dynamically pick the base URL depending on the environment
// const baseURL = import.meta.env.VITE_DEVLOP_API_BASE_URL;
// const baseURL = import.meta.env.VITE_LOCAL_API_BASE_URL
const baseURL = import.meta.env.VITE_TEST_API_BASE_URL;
// const baseURL = `https://test.curo24.com`;
// const baseURL = import.meta.env.VITE_PRODUCTION_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
