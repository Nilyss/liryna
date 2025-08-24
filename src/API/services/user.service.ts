import { getRequest, patchRequest, deleteRequest } from "../APICalls.ts";
import { AxiosResponse } from "axios";
import { IUser, IApiResponse } from "../../utils/types/user.types.ts";
import { userModel } from "../models/user.model.ts";

export const getCurrentUserService = async (): Promise<IUser> => {
  const response: AxiosResponse<IApiResponse<IUser>> = await getRequest("/users/profile");
  
  if (response.data.success && response.data.data) {
    return userModel(response.data.data);
  }
  
  throw new Error(response.data.message || "Failed to get user profile");
};

export const getAllUsersService = async (): Promise<IUser[]> => {
  const response: AxiosResponse<IApiResponse<IUser[]>> = await getRequest("/users");
  
  if (response.data.success && response.data.data) {
    return response.data.data.map(user => userModel(user));
  }
  
  throw new Error(response.data.message || "Failed to get users");
};

export const getUserByIdService = async (id: number): Promise<IUser> => {
  const response: AxiosResponse<IApiResponse<IUser>> = await getRequest(`/users/${id}`);
  
  if (response.data.success && response.data.data) {
    return userModel(response.data.data);
  }
  
  throw new Error(response.data.message || "Failed to get user");
};

export const updateUserService = async (
  id: number,
  userData: Partial<Pick<IUser, 'email' | 'firstName' | 'lastName' | 'password'>>
): Promise<IUser> => {
  const response: AxiosResponse<IApiResponse<IUser>> = await patchRequest(`/users/${id}`, userData);
  
  if (response.data.success && response.data.data) {
    return userModel(response.data.data);
  }
  
  throw new Error(response.data.message || "Failed to update user");
};

export const deleteUserService = async (id: number): Promise<void> => {
  const response: AxiosResponse<IApiResponse> = await deleteRequest(`/users/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete user");
  }
};
