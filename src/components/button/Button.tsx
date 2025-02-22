// styles
import "./button.scss";

// types
import { ReactElement, MouseEvent } from "react";

interface IButtonProps {
  style: "orange" | "white" | "grey" | "green" | "red";
  text: string | undefined;
  type: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  style,
  text,
  type,
  disabled,
  onClick,
}: Readonly<IButtonProps>): ReactElement | null {
  const className = `${style}Button`;

  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
