import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // 替换为你的 API 基础 URL
});

// 请求拦截器：添加 JWT Token 到 Header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 从 localStorage 获取 Token
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
  async (error) => {
    // 只有在收到 401 错误时才尝试刷新 token
    if (error.response?.status === 401) {
      try {
        console.log('Token expired, attempting to refresh...');
        const response = await apiClient.post('/user/refreshToken', {}, { withCredentials: true });

        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // 更新 token 后重试原请求
          const newToken = response.data.accessToken;
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          return apiClient(error.config);
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 对于非 401 错误或刷新失败的情况，直接返回原错误
    return Promise.reject(error);
  }
);

export default apiClient;
