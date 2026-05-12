import React from 'react'
import { useNavigate } from "react-router-dom"

import styles from "./ProductCategories.module.css"
import ButtonStd from "@/components/UI/ButtonStd"
import NavSpacer from '@/features/navbar/NavSpacer'
import SearchBar from '@/features/search/SearchBar'

const categories = [
  { label: "T-Shirts", value: "T-shirts" },
  { label: "Shoes", value: "Shoes" },
  { label: "Pants", value: "Pants" },
  { label: "Shirts", value: "Shirts" },
  { label: "Jackets", value: "Jackets" },
  { label: "Accessories", value: "Accessories" },
]

const ProductCategories = () => {

  const navigate = useNavigate()

  return (
    <nav className={styles.productCategories}>
      <div className={styles.container}>
        <ButtonStd variant="secondary" bold onClick={() => navigate("/products")}>All Products</ButtonStd>
        <NavSpacer size={"0.5rem"}/>
        {categories.map((category) => (
          <ButtonStd
              key={category.value}
              variant="secondary"
              onClick={() => navigate(`/products?category=${encodeURIComponent(category.value)}`)} > 
              {category.label}
          </ButtonStd>
          ))}
      </div>
      <div className={styles.container}>
        <SearchBar/>
      </div>
    </nav>
  )
}

export default ProductCategories
