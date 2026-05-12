import React from 'react'
import styles from "./Hero.module.css"

interface HeroProps {
  image: string
  image2?: string
  image3?: string
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
  image2,
  image3,
  title,
  subtitle,
  description,
  children,
  fullWidth = false,
  halfSize = false,
  squareSize = false,
  textBesideImage = false,
}: HeroProps) => {
  const providedImages = [image, image2, image3].filter(Boolean) as string[]
  const images = providedImages.length === 2
    ? [providedImages[0], providedImages[1], providedImages[0]]
    : providedImages
  const hasSlideshow = providedImages.length > 1
  const getSlideDelay = (index: number) => {
    if (!hasSlideshow || index === 0) return undefined

    return `${-(12 - index * 4)}s`
  }

  const slideshow = (
    <div className={`${styles.slideshow} ${hasSlideshow ? styles.isAnimated : ""}`} aria-hidden="true">
      {images.map((heroImage, index) => (
        <div
          key={`${heroImage}-${index}`}
          className={styles.slide}
          style={{
            backgroundImage: `url(${heroImage})`,
            animationDelay: getSlideDelay(index),
          }}
        />
      ))}
    </div>
  )

  return (
  <div
    className={`${styles.hero} ${fullWidth ? styles.fullWidth : ""} ${halfSize ? styles.halfSize : ""} ${squareSize ? styles.squareSize : ""} ${textBesideImage ? styles.textBesideImage : ""}`}
  >
    {textBesideImage && (
      <div className={styles.sideImage}>
        {slideshow}
      </div>
    )}
    {!textBesideImage && slideshow}
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
