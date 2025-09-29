import { ReactElement, ReactNode } from "react";

interface buttonProps {
  children?: ReactNode;
  className: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({
  children,
  className,
  type,
  onClick,
}: buttonProps): ReactElement => {
  
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
