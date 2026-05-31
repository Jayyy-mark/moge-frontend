import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {

        const originalRequest = error.config;

        const isAuthRoute =
            originalRequest?.url?.includes("/api/auth/login/");

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthRoute // ✅ skip auth routes
        ) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    "http://localhost:8000/api/auth/token/refresh/",
                    {},
                    { withCredentials: true }
                );

                return api(originalRequest);
            } catch (err) {
                window.location.href = "/signin";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);


export type ApiResponse<T> = Promise<T>;

export const getApi = async <T>(url: string): ApiResponse<T> => {
    const response: AxiosResponse = await api.get(url);
    return response.data;
}

export const postApi = async <T, U>(url: string, body: U): ApiResponse<T> => {
    const response = await api.post<T>(url, body);
    return response.data;
}

export const deleteApi = async <T>(url: string): ApiResponse<T> => {
    const response = await api.delete<T>(url);
    return response.data;
}

export const fetchCurrentUser = async () => {
    const res = await getApi("auth/me/");
    return res;
}

export const API_SERVER = import.meta.env.VITE_API_SERVER;

export default api;