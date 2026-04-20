import React from 'react'
import styles from "./ProductView.module.css"

import ProductImage from "@/assets/1.webp"

const ProductView = () => {
  return (
    <section className={styles.container}>
        <img src={ProductImage} className={styles.productImage}/>
        <div className={styles.productContainer}>
            <h1>Hej</h1>
        </div>
    </section>
  )
}

export default ProductView