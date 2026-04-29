import React from 'react'
import Styles from "./ButtonStd.module.css"

interface ButtonStdProps {
    children: React.ReactNode
    variant?: "primary" | "secondary" | "ghost-dark" | "ghost-light" | "border"
    bold?: boolean
    fullWidth?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    disabled?: boolean 
}

const ButtonStd: React.FC<ButtonStdProps> = ({children, variant = "secondary", bold = false, fullWidth = false, onClick, className="", disabled = false}) => {
return (
    <button
      onClick={onClick}
      disabled={disabled}
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