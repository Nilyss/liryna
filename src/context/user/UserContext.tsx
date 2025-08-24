// custom types
import { IUser, IUserCredentials, IUserRegistration } from "../../utils/types/user.types.ts";
import { createContext, Context } from "react";

interface IUserContext {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: IUser | null) => void;
    login: (credentials: IUserCredentials) => Promise<void>;
    register: (userData: IUserRegistration) => Promise<void>;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
}

export const UserContext: Context<IUserContext> = createContext<IUserContext>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    setUser: (): void => {},
    login: async (): Promise<void> => {},
    register: async (): Promise<void> => {},
    logout: (): void => {},
    getCurrentUser: async (): Promise<void> => {},
});