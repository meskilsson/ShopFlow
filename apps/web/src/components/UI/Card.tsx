import React from "react";
import styles from "./Card.module.css";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  variant?: "default" | "transparent";
};

const Card = ({ children, variant = "default", className = "", ...props }: Props) => {
  return (
    <div
      className={`${styles.card} ${variant === "transparent" ? styles.transparent : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;