import React from "react";
import Styles from "./ButtonStd.module.css";

interface ButtonStdProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost-dark" | "ghost-light";
  bold?: boolean;
  fullWidth?: boolean;
}

const ButtonStd: React.FC<ButtonStdProps> = ({
  children,
  variant = "secondary",
  bold = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      style={{
        fontWeight: bold ? "bold" : "normal",
        ...props.style,
      }}
      className={`
                ${Styles.btnBase}
                ${Styles[variant]}
                ${fullWidth ? Styles.fullWidth : ""}
                ${className}
            `}
    >
      {children}
    </button>
  );
};

export default ButtonStd;
