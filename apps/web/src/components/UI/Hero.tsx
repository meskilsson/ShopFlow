import React from 'react'
import styles from "./Hero.module.css"

interface HeroProps {
  image: string
  title?: string
  subtitle?: string
  children?: React.ReactNode
  fullWidth?: boolean
  halfSize?: boolean
}

const Hero = ({ image, title, subtitle, children, fullWidth = false, halfSize = false }: HeroProps) => {
  return (
  <div
    className={`${styles.hero} ${fullWidth ? styles.fullWidth : ""} ${halfSize ? styles.halfSize : ""}`}
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className={styles.overlay}>
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  </div>
)
}

export default Hero