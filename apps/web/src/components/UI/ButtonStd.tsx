import React from 'react'
import Styles from "./ButtonStd.module.css"

interface ButtonStdProps {
    text: any
    variant?: "primary" | "secondary" | "ghost"
    bold?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const ButtonStd: React.FC<ButtonStdProps> = ({text, variant = "secondary", bold = false, onClick}) => {
return (
    <button onClick={onClick} style={{fontWeight: bold ? "bold" : "normal"}} className={`${Styles.btnBase} ${Styles[variant]}`}>
        {text}
    </button>
    )
}

export default ButtonStd