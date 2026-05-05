import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor attaches token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor handles 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      console.log("Token expired or invalid. Logging out...");

      // remove token
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;