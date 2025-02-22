// hooks | library
import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useContext,
  useEffect,
} from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

// custom types
interface ISignInFormProps {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
}

// context
import { UserContext } from "../../context/user/UserContext.tsx";
import { IUserCredentials } from "../../utils/types/user.types.ts";

// components
import Button from "../button/Button.tsx";

export default function SignInForm({
  email,
  password,
  setEmail,
  setPassword,
}: Readonly<ISignInFormProps>): ReactElement {
  const navigate: NavigateFunction = useNavigate();
  const { getUser, user } = useContext(UserContext);

  const handleSubmit = async (): Promise<void> => {
    const credentials: IUserCredentials = {
      email,
      password,
    };
    await getUser(credentials);
  };

  useEffect((): void => {
    if (user) {
      console.log("user =>", user);
      navigate("/home");
    }
  }, [user]);

  return (
    <form
      id={"authForm"}
      onSubmit={(e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        handleSubmit().finally();
      }}
    >
      <h2>Se connecter</h2>
      <div className={"inputContainer"}>
        <label htmlFor={"email"}>Identifiant</label>
        <input
          id={"email"}
          type={"email"}
          value={email}
          autoComplete={"on"}
          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
            setEmail(e.target.value)
          }
        />
      </div>
      <div className={"inputContainer"}>
        <label htmlFor={"password"}>Mot de passe</label>
        <input
          id={"password"}
          type={"password"}
          value={password}
          autoComplete={"on"}
          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
            setPassword(e.target.value)
          }
        />
      </div>
      <div className={"buttonContainer"}>
        <Button style="orange" text="Connexion" type="submit" />
      </div>
    </form>
  );
}
