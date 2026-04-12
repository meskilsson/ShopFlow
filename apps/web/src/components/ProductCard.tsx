import React from 'react'
import styles from "./ProductCard.module.css"

import ProductImage from "../assets/1.webp"

const ProductCard = () => {
  return (
    <div className={styles.card}>
        <img src={ProductImage} className={styles.productImage}/>
        <div className={styles.productInfo}>
            <h2 className={styles.productTitle}>DUNK LOW RETRO</h2>
            <h3 className={styles.productBrand}>Nike Sportswear</h3>
            <p className={styles.productVariants}>1 variant</p>
            <p className={styles.productPrice}>1 200 kr</p>
        </div>
    </div>
  )
}

export default ProductCard