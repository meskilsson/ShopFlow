import React from 'react'
import styles from "./ProductView.module.css"

import ProductImage from "@/assets/1.webp"
import HeartIconStd from "@/assets/icons/heart-regular-full.svg?react"

import ButtonStd from '../ButtonStd'

const ProductView = () => {

  const product = {
    name: "DUNK LOW RETRO",
    brand: "Nike Sportswear",
    rating: 4,
    price: 1200,
    seller: "Port 666™"
  }

  const comments = [
    {
      user: "Chas-Robin",
      comment: "Love these boots!",
      rating: 4.5,
    },
    {
      user: "Marcus",
      comment: "Livets dojjor",
      rating: 5,
    },
    {
      user: "Robin",
      comment: "Jag fick bara en 😟",
      rating: 1,
    }
  ]

  return (
    <section className={styles.productContainer}>
      <img src={ProductImage} className={styles.productImage} />

      <div className={styles.sidebar}>

        {/* Main product*/}
        <div className={styles.surfaceBlock}>
          <div className={styles.productInfo}>
            <h2 className={styles.productBrand}>{product.brand}</h2>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <p className={styles.productRating}>Rating: {product.rating}/5 ⭐</p>
            <p className={styles.productPrice}>{product.price} kr <span className={styles.vat}>incl. VAT</span></p>
          </div>
          <div className={styles.buttonContainer}>
              <ButtonStd variant='primary' fullWidth>Add to cart</ButtonStd>
              <ButtonStd variant='ghost'><HeartIconStd className={styles.buttonIcon}/></ButtonStd>
          </div>
        </div>

        {/* Seller info*/}
        <div className={styles.surfaceBlock}>
          <h2 className={styles.sellerInfo}>This product is sold by <span className={styles.seller}>{product.seller}</span></h2>
        </div>

        {/* Comments*/}
        <section className={styles.surfaceBlock}>
          <p className={styles.commentsText}>Comments:</p>
          <section className={styles.comment}>
            {comments.map((c, index) => (
              <div key={index} className={styles.commentItem}>
                <div className={styles.commentContainer}>
                  <div className={styles.commentImg}>
                    {/* Bild här */}
                  </div>
                  <div className={styles.commentText}>
                    <h2 className={styles.commentName}>{c.user} <span className={styles.commentRating}>Rating: {c.rating}/5</span></h2>
                    <p className={styles.commentComment}>{c.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>
      </div>

    </section>
  )
}

export default ProductView