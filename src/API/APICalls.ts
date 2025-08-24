// libraries
import axios, { AxiosResponse } from "axios";

// utils
import { isOnProduction } from "../utils/scripts/utils.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = 10000;
axios.defaults.baseURL = isOnProduction()
  ? "http://192.168.1.56:8800/api"
  : "http://192.168.1.56:8800/api";
axios.defaults.withCredentials = false;

// Interceptor pour ajouter le token JWT automatiquement
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRequest: (url: string) => Promise<AxiosResponse> = async (
  url: string,
): Promise<AxiosResponse> => {
  return await axios.get(url);
};

export const postRequest = async <T, R>(
  url: string,
  data: T,
): Promise<AxiosResponse<R>> => {
  try {
    return await axios.post<R>(url, data);
  } catch (error) {
    console.error("Erreur in postRequest:", error);
    throw error;
  }
};

export const patchRequest = async <T, R>(
  url: string,
  data: T,
): Promise<AxiosResponse<R>> => {
  try {
    return await axios.patch<R>(url, data);
  } catch (error) {
    console.error("Erreur in patchRequest:", error);
    throw error;
  }
};

export const deleteRequest = async <R>(
  url: string,
): Promise<AxiosResponse<R>> => {
  try {
    return await axios.delete<R>(url);
  } catch (error) {
    console.error("Erreur in deleteRequest:", error);
    throw error;
  }
};
