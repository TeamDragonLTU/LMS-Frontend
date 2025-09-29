import { ReactElement } from "react";

interface buttonProps {
  text: string;
  className: string;
  onClick?: () => void;
}

const Button = ({ text, className, onClick }: buttonProps): ReactElement => {
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
