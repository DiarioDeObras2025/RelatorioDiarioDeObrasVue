import axios from "axios";
import { AuthService } from "@/services/AuthService";
import router from "@/router";

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const api = axios.create({
  baseURL: "https://localhost:7159",
});

// Adiciona token em cada requisição
api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Controla requisições pendentes enquanto o token é renovado
function subscribeTokenRefresh(cb: () => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

// Intercepta respostas para lidar com 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { token: accessToken, refreshToken, expiration } = await AuthService.refreshToken();

          AuthService.login({ token: accessToken, refreshToken, expiration });

          isRefreshing = false;
          onRefreshed();

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          AuthService.logout();
          router.push("/login");
          return Promise.reject(refreshError);
        }
      }

      // Se já estiver atualizando o token, espera
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          originalRequest.headers.Authorization = `Bearer ${AuthService.getToken()}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);

export default api;
