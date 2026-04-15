import React from 'react'
import styles from "./ProductView.module.css"

import ProductImage from "@/assets/1.webp"
import HeartIconStd from "@/assets/icons/heart-regular-full.svg?react"

import ButtonStd from '../ButtonStd'

const ProductView = () => {
  return (
    <section className={styles.productContainer}>
      <img src={ProductImage} className={styles.productImage} />

      <div className={styles.sidebar}>
          <div className={styles.productInfo}>
            <h2 className={styles.productBrand}>Nike Sportswear</h2>
            <h1 className={styles.productTitle}>DUNK LOW RETRO</h1>
            <p className={styles.productRating}>Rating: 4,5/5</p>
            <p className={styles.productPrice}>1200 kr incl. VAT</p>
          </div>
          <div className={styles.buttonContainer}>
              <ButtonStd variant='primary' fullWidth text={"Add to cart"}/>
              <ButtonStd variant='ghost' text={"Save"}/>
          </div>
      </div>
    </section>
  )
}

export default ProductView