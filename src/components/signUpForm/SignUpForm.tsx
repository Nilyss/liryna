// hooks | library
import { ChangeEvent, ReactElement } from "react";

// custom types
interface ISignUpFormProps {
  email: string;
  password: string;
  passwordConfirmation: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPasswordConfirmation: (value: string) => void;
}

// components
import Button from "../button/Button";

export default function SignUpForm({
  email,
  password,
  passwordConfirmation,
  setEmail,
  setPassword,
  setPasswordConfirmation,
}: Readonly<ISignUpFormProps>): ReactElement {
  return (
    <form id={"authForm"}>
      <h2>Crée un compte</h2>
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
      <div className={"inputContainer"}>
        <label htmlFor={"passwordConfirmation"}>
          Confirmer le mot de passe
        </label>
        <input
          id={"passwordConfirmation"}
          type={"password"}
          value={passwordConfirmation}
          autoComplete={"off"}
          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
            setPasswordConfirmation(e.target.value)
          }
        />
      </div>
      <div className={"buttonContainer"}>
        <Button style={"orange"} text={"S'enregistrer"} type={"button"} />
      </div>
    </form>
  );
}
