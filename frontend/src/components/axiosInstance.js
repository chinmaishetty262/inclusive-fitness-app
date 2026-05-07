import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});


  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const url = err.config?.url;


    if (url.includes("/api/auth/login") || url.includes("/api/auth/signup")) {
      return Promise.reject(err);
    }

 if (err.response && err.response.status === 401) {
      const message = err.response.data?.message;
    console.log("Interceptor triggered", err.response);
      // store message temporarily
      localStorage.setItem("authError", message || "Session expired");

      // remove token
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      // redirect
      setTimeout(() => {
      window.location.href = "/login";
      }, 1000);
    }

    return Promise.reject(err);
  }
  );



export default axiosInstance;