import React from "react";
import styles from "./Card.module.css";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  variant?: "default" | "transparent";
  fullWidth?: boolean;
};

const Card = ({ children, variant = "default", fullWidth = false, className = "", ...props }: Props) => {
  return (
    <div
      className={`${styles.card} ${variant === "transparent" ? styles.transparent : ""} ${fullWidth ? styles.fullWidth : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;