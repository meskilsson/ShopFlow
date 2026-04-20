import React from 'react'
import styles from "./ProductCategories.module.css"
import ButtonStd from "@/components/UI/ButtonStd"
import NavSpacer from '@/features/navbar/NavSpacer'
import SearchBar from '@/features/search/SearchBar'

const ProductCategories = () => {
  return (
    <nav className={styles.productCategories}>
      <div className={styles.container}>
        <ButtonStd variant="secondary" bold>Show All</ButtonStd>
        <NavSpacer size={"0.5rem"}/>
        <ButtonStd variant="secondary">T-Shirts</ButtonStd>
        <ButtonStd variant="secondary">Shoes</ButtonStd>
        <ButtonStd variant="secondary">Pants</ButtonStd>
        <ButtonStd variant="secondary">Shirts</ButtonStd>
        <ButtonStd variant="secondary">Jackets</ButtonStd>
        <ButtonStd variant="secondary">Accessories</ButtonStd>
      </div>
      <div className={styles.container}>
        <SearchBar/>
      </div>
    </nav>
  )
}

export default ProductCategories