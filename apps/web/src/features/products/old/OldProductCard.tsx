import React from 'react'
import { Link } from "react-router-dom"
import styles from "./ProductCard.module.css"

import ProductImage from "@/assets/1.webp"

interface ProductCardProps {
  title: string
  brand: string
  variants: string
  price: string
  link: string
}

const ProductCard = ({title, brand, variants, price, link}: ProductCardProps) => {
  return (
    <Link to={link} className={styles.card}>
      <img src={ProductImage} className={styles.productImage}/>
      <div className={styles.productInfo}>
          <h2 className={styles.productTitle}>{title}</h2>
          <h3 className={styles.productBrand}>{brand}</h3>
          <p className={styles.productVariants}>{variants} variants</p>
          <p className={styles.productPrice}>{price} kr</p>
      </div>
    </Link>
    
  )
}

export default ProductCard