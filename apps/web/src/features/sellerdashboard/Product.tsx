import React from 'react'
import styles from "./Product.module.css"



const Product = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.infoContainer}>
            <p>Product</p>
            <p>April 28, 2025</p>
        </div>
        <div className={styles.infoContainer}>
            <div className={styles.activeButton}>Active</div>
        </div>
    </div>
  )
}

export default Product