import React from 'react'
import styles from "./ProductCategories.module.css"
import ButtonStd from "../ButtonStd"
import NavSpacer from './NavSpacer'
import SearchBar from './SearchBar'

const ProductCategories = () => {
  return (
    <nav className={styles.productCategories}>
      <div className={styles.container}>
        <ButtonStd variant="secondary" bold text="Show All"/>
        <NavSpacer size={"0.5rem"}/>
        <ButtonStd variant="secondary" text="T-Shirts"/>
        <ButtonStd variant="secondary" text="Shoes"/>
        <ButtonStd variant="secondary" text="Pants"/>
        <ButtonStd variant="secondary" text="Shirts"/>
        <ButtonStd variant="secondary" text="Jackets"/>
        <ButtonStd variant="secondary" text="Accessories"/>
      </div>
      <div className={styles.container}>
        <SearchBar/>
      </div>
    </nav>
  )
}

export default ProductCategories