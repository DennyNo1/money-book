import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // 替换为你的 API 基础 URL
});

// 请求拦截器：添加 JWT Token 到 Header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("money-book-token"); // 从 localStorage 获取 Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 将 Token 添加到 Authorization Header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 处理请求错误
  }
);

// 响应拦截器：处理通用的错误（如身份验证失败）
apiClient.interceptors.response.use(
  (response) => {
    return response; // 如果响应正常，直接返回
  },
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   console.error("Unauthorized: Token may be expired or invalid.");
    //   // 可以选择清除 Token 或重定向到登录页面
    //   localStorage.removeItem("token");
    //   window.location.href = "/login";
    // }
    return Promise.reject(error); // 返回错误
  }
);

export default apiClient;
