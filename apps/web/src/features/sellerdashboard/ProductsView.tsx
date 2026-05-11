import React from 'react'
import Product from './Product'
import styles from "./ProductsView.module.css"

import ButtonStd from '@/components/UI/ButtonStd'
import AddIcon from "@/assets/icons/plus-solid-full.svg?react"

const ProductsView = () => {

  const mockProducts = [
    {
      name: "Running Shoes",
      dateAdded: "2025-04-10",
      variants: 4,
      active: true
    },
    {
      name: "Leather Jacket",
      dateAdded: "2025-03-22",
      variants: 3,
      active: true
    },
    {
      name: "Baseball Cap",
      dateAdded: "2025-04-01",
      variants: 6,
      active: false
    },
    {
      name: "Denim Jeans",
      dateAdded: "2025-02-15",
      variants: 8,
      active: true
    },
    {
      name: "Wool Sweater",
      dateAdded: "2025-04-28",
      variants: 2,
      active: false
    },
    {
      name: "Sunglasses",
      dateAdded: "2025-05-01",
      variants: 3,
      active: true
    },
    {
      name: "Canvas Backpack",
      dateAdded: "2025-01-18",
      variants: 5,
      active: true
    },
    {
      name: "Ankle Boots",
      dateAdded: "2025-03-09",
      variants: 4,
      active: false
    },
    {
      name: "Graphic Tee",
      dateAdded: "2025-04-14",
      variants: 7,
      active: true
    },
    {
      name: "Cargo Shorts",
      dateAdded: "2025-02-27",
      variants: 3,
      active: false
    }
  ]

  return (
    <>
        <h2 className={styles.subHeader}>Product Listings</h2>
        <ButtonStd>Add Product</ButtonStd>
        <section className={styles.wrapper}>
            {mockProducts.map((product, index) => (
              <Product
                key={index}
                name={product.name}
                dateAdded={product.dateAdded}
                variants={product.variants}
                active={product.active}
              />
            ))}
        </section>
    </>
  )
}

export default ProductsView