import React from 'react'
import Product from './Product'
import styles from "./ProductsView.module.css"

const ProductsView = () => {
  return (
    <>
        <h2 className={styles.subHeader}>Product Listings</h2>
        <section className={styles.wrapper}>
            <Product/>
            <Product/>
            <Product/>
            <Product/>
            <Product/>
        </section>
    </>
  )
}

export default ProductsView