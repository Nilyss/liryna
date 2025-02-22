// libraries
import axios, { AxiosResponse } from "axios";

// utils
import { isOnProduction } from "../utils/scripts/utils.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = 10000;
axios.defaults.baseURL = isOnProduction()
  ? "https://nilyss.github.io/whatAToolMockup"
  : "/mock";
axios.defaults.withCredentials = !isOnProduction();

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
    console.log("isOnProduction ?", isOnProduction());
    return await axios.post<R>(url, data);
  } catch (error) {
    console.error("Erreur in postRequest:", error);
    throw error;
  }
};
