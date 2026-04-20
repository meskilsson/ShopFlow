import React from 'react'
import styles from "./Hero.module.css"

interface HeroProps {
  image: string
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

const Hero = ({ image, title, subtitle, children }: HeroProps) => {
  return (
    <div
      className={styles.hero}
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