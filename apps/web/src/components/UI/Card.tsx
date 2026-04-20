import React from 'react'
import styles from "./Card.module.css"

type Props = {
  children: React.ReactNode;
  variant?: "default" | "transparent"
};

const Card = ({children, variant = "default"}: Props) => {
  return (
    <div className={`${styles.card} ${variant === "transparent" ? styles.transparent : ""}`} >
        {children}
    </div>
  )
}

export default Card