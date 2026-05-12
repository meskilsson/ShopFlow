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

const categories = [
    { label: "T-Shirts", value: "T-shirts" },
    { label: "Shoes", value: "Shoes" },
    { label: "Pants", value: "Pants" },
    { label: "Shirts", value: "Shirts" },
    { label: "Jackets", value: "Jackets" },
    { label: "Accessories", value: "Accessories" },
]

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

                    {categories.map((category) => (
                        <ButtonStd
                            key={category.value}
                            variant="ghost-light"
                            onClick={() => navigate(`/products?category=${encodeURIComponent(category.value)}`)} > 
                            {category.label}
                        </ButtonStd>
                    ))}
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