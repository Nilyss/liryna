import { isOnProduction } from "../../utils/scripts/utils.ts";
import { getRequest } from "../APICalls.ts";

// custom types
import { AxiosResponse } from "axios";
import { IUser, IUserCredentials } from "../../utils/types/user.types.ts";

// model
import { userModel } from "../models/user.model.ts";

export const getUserService = async (
  credentials: IUserCredentials,
  // userID?: IUser["id"],
): Promise<IUser> => {
  const endpoint: string = isOnProduction()
    ? `/userMock.JSON`
    : "/userMock.JSON";

  const response: AxiosResponse<IUser | IUser[]> = await getRequest(endpoint);

  if (!isOnProduction()) {
    const users = response.data as IUser[];
    const foundUser: IUser | undefined = users.find(
      (user: IUser): boolean => user.email === credentials.email,
    );

    if (!foundUser || foundUser.password !== credentials.password) {
      throw new Error(`Invalid credentials. Try Again.`);
    }

    return userModel(foundUser);
  }
  return userModel(response.data as IUser);
};
