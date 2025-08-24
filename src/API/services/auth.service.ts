import { AxiosResponse } from "axios";
import { postRequest } from "../APICalls.ts";
import { IUserCredentials, IUserRegistration, IAuthResponse } from "../../utils/types/user.types.ts";

export const loginService = async (credentials: IUserCredentials): Promise<IAuthResponse> => {
  const response: AxiosResponse<IAuthResponse> = await postRequest<IUserCredentials, IAuthResponse>(
    "/users/login",
    credentials
  );
  
  if (response.data.success && response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  
  return response.data;
};

export const registerService = async (userData: IUserRegistration): Promise<IAuthResponse> => {
  const response: AxiosResponse<IAuthResponse> = await postRequest<IUserRegistration, IAuthResponse>(
    "/users/register",
    userData
  );
  
  if (response.data.success && response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  
  return response.data;
};

export const logoutService = (): void => {
  localStorage.removeItem('authToken');
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('authToken');
};