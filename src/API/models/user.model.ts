import { IUser } from "../../utils/types/user.types";

export const userModel = (fetchedUser: IUser): IUser => {
  return {
    id: fetchedUser.id,
    email: fetchedUser.email,
    firstName: fetchedUser.firstName,
    lastName: fetchedUser.lastName,
  };
};
