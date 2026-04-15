import React from 'react'
import styles from "./ProductView.module.css"

import ProductImage from "@/assets/1.webp"
import HeartIconStd from "@/assets/icons/heart-regular-full.svg?react"

import ButtonStd from '../ButtonStd'

const ProductView = () => {

  const product = {
    name: "DUNK LOW RETRO",
    brand: "Nike Sportswear",
    rating: 4.5,
    price: 1200
  }

  return (
    <section className={styles.productContainer}>
      <img src={ProductImage} className={styles.productImage} />

      <div className={styles.sidebar}>
          <div className={styles.productInfo}>
            <h2 className={styles.productBrand}>{product.brand}</h2>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <p className={styles.productRating}>Rating: {product.rating}/5 ⭐</p>
            <p className={styles.productPrice}>{product.price} kr <span className={styles.vat}>incl. VAT</span></p>
          </div>
          <div className={styles.buttonContainer}>
              <ButtonStd variant='primary' fullWidth>Add to cart</ButtonStd>
              <ButtonStd variant='ghost'>Save</ButtonStd>
          </div>
      </div>
    </section>
  )
}

export default ProductView