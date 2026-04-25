import React from 'react'
import { useNavigate } from "react-router-dom"

import styles from "./ProductCategories.module.css"
import ButtonStd from "@/components/UI/ButtonStd"
import NavSpacer from '@/features/navbar/NavSpacer'
import SearchBar from '@/features/search/SearchBar'

const ProductCategories = () => {

  const navigate = useNavigate()

  return (
    <nav className={styles.productCategories}>
      <div className={styles.container}>
        <ButtonStd variant="secondary" bold onClick={() => navigate("/products")}>All Products</ButtonStd>
        <NavSpacer size={"0.5rem"}/>
        <ButtonStd variant="secondary" onClick={() => navigate("/products")}>T-Shirts</ButtonStd>
        <ButtonStd variant="secondary" onClick={() => navigate("/products")}>Shoes</ButtonStd>
        <ButtonStd variant="secondary" onClick={() => navigate("/products")}>Pants</ButtonStd>
        <ButtonStd variant="secondary" onClick={() => navigate("/products")}>Shirts</ButtonStd>
        <ButtonStd variant="secondary" onClick={() => navigate("/products")}>Jackets</ButtonStd>
        <ButtonStd variant="secondary" onClick={() => navigate("/products")}>Accessories</ButtonStd>
      </div>
      <div className={styles.container}>
        <SearchBar/>
      </div>
    </nav>
  )
}

export default ProductCategories