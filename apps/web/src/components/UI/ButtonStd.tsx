import React from 'react'
import Styles from "./ButtonStd.module.css"

interface ButtonStdProps {
    children: React.ReactNode
    variant?: "primary" | "secondary" | "ghost-dark" | "ghost-light"
    bold?: boolean
    fullWidth?: boolean
    className?: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const ButtonStd: React.FC<ButtonStdProps> = ({children, variant = "secondary", bold = false, fullWidth = false, className = "", onClick}) => {
return (
    <button
      onClick={onClick}
      style={{ fontWeight: bold ? "bold" : "normal" }}
      className={`
        ${Styles.btnBase} 
        ${Styles[variant]}
        ${fullWidth ? Styles.fullWidth : ""}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default ButtonStd