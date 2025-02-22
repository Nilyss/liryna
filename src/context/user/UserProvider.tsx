// hooks | libraries
import { useState, useMemo, ReactElement } from "react";

// context
import { UserContext } from "./UserContext.tsx";

// custom types
import { IUser, IUserCredentials } from "../../utils/types/user.types.ts";

// services
import { getUserService } from "../../API/services/user.service.ts";

export const UserProvider = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  const [user, setUser] = useState<IUser | null>(null);

  const getUser = async (
    userCredentials: IUserCredentials,
    // userID?: IUser["id"],
  ): Promise<void> => {
    // add a timer to avoid flashing du to loader if datas fetch is instant
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const res: IUser = await getUserService(userCredentials);
      setUser(res);
    } catch (error) {
      console.error("Error while getting user :", error);
      setUser(null);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      getUser,
    }),
    [user],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
