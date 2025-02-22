// custom types
import { IUser, IUserCredentials } from "../../utils/types/user.types.ts";
import { createContext, Context } from "react";

interface IUserContext {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    getUser: (userCredentials: IUserCredentials, userID?: IUser['id']) => Promise<void>;
}

export const UserContext: Context<IUserContext> = createContext<IUserContext>({
    user: null,
    setUser: (): void => {},
    getUser: async (): Promise<void> => {},
});