import axios from "axios";

// Configurar la URL base para las solicitudes de API
axios.defaults.baseURL = "http://localhost:5000";

// Interceptor para añadir token automáticamente
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
