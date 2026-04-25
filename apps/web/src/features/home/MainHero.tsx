import React from 'react'
// import styles from "@/components/UI/Hero.module.css"
import styles from "./MainHero.module.css"
import { div } from 'framer-motion/client'
import ButtonStd from '@/components/UI/ButtonStd'
import SearchBar from '../search/SearchBar'
import NavSpacer from '../navbar/NavSpacer'
import { useNavigate } from "react-router-dom"

interface HeroProps {
  image: string
  title?: string
  subtitle?: string
  children?: React.ReactNode
  fullWidth?: boolean
}

const Hero = ({ image, title, subtitle, children, fullWidth = false }: HeroProps) => {
    const navigate = useNavigate()
  return (
    <>
        <div
            className={`${styles.hero} ${fullWidth ? styles.fullWidth : ""}`}
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className={styles.overlay}>
            <div className={styles.heroNav}>
                <nav className={styles.productCategories}>
                <div className={styles.container}>
                    <ButtonStd variant="ghost-light" bold onClick={() => navigate("/products")}>All Products</ButtonStd>
                    <NavSpacer size={"0.5rem"}/>
                    <ButtonStd variant="ghost-light" onClick={() => navigate("/products")}>T-Shirts</ButtonStd>
                    <ButtonStd variant="ghost-light" onClick={() => navigate("/products")}>Shoes</ButtonStd>
                    <ButtonStd variant="ghost-light" onClick={() => navigate("/products")}>Pants</ButtonStd>
                    <ButtonStd variant="ghost-light" onClick={() => navigate("/products")}>Shirts</ButtonStd>
                    <ButtonStd variant="ghost-light" onClick={() => navigate("/products")}>Jackets</ButtonStd>
                    <ButtonStd variant="ghost-light" onClick={() => navigate("/products")}>Accessories</ButtonStd>
                </div>
                <div className={styles.container}>
                    <SearchBar/>
                </div>
            </nav>
            </div>
            <div className={styles.textContainer}>
                {title && <h1>{title}</h1>}
                {subtitle && <p>{subtitle}</p>}
                {children}
            </div>
            </div>
        </div>
    </>
)
}

export default Hero