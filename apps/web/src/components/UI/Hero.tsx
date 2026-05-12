import React from 'react'
import styles from "./Hero.module.css"

interface HeroProps {
  image: string
  title?: string
  subtitle?: string
  description?: string
  children?: React.ReactNode
  fullWidth?: boolean
  halfSize?: boolean
  squareSize?: boolean
  textBesideImage?: boolean
}

const Hero = ({
  image,
  title,
  subtitle,
  description,
  children,
  fullWidth = false,
  halfSize = false,
  squareSize = false,
  textBesideImage = false,
}: HeroProps) => {
  return (
  <div
    className={`${styles.hero} ${fullWidth ? styles.fullWidth : ""} ${halfSize ? styles.halfSize : ""} ${squareSize ? styles.squareSize : ""} ${textBesideImage ? styles.textBesideImage : ""}`}
    style={textBesideImage ? undefined : { backgroundImage: `url(${image})` }}
  >
    {textBesideImage && (
      <div
        className={styles.sideImage}
        style={{ backgroundImage: `url(${image})` }}
      />
    )}
    <div className={styles.overlay}>
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  </div>
)
}

export default Hero
