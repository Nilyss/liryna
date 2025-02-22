// styles
import "./authForm.scss";

// hooks | library
import { ReactElement } from "react";

// component
import SignInForm from "../signInForm/SignInForm";
import SignUpForm from "../signUpForm/SignUpForm";

interface IAuthFormProps {
  props: {
    isSignIn: boolean;
    email: string;
    password: string;
    passwordConfirmation: string;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setPasswordConfirmation: (value: string) => void;
  };
}

export default function AuthForm({
  props,
}: Readonly<IAuthFormProps>): ReactElement {
  const {
    isSignIn,
    email,
    password,
    passwordConfirmation,
    setEmail,
    setPassword,
    setPasswordConfirmation,
  } = props;

  return (
    <>
      {isSignIn ? (
        <SignInForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      ) : (
        <SignUpForm
          email={email}
          password={password}
          passwordConfirmation={passwordConfirmation}
          setEmail={setEmail}
          setPassword={setPassword}
          setPasswordConfirmation={setPasswordConfirmation}
        />
      )}
    </>
  );
}
