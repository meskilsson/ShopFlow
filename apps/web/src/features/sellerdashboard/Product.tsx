import React from 'react'
import styles from "./Product.module.css"
import ButtonStd from '@/components/UI/ButtonStd'

import TrashIcon from "@/assets/icons/trash-can-solid-full.svg?react"
import EditIcon from "@/assets/icons/pen-to-square-solid-full.svg?react"

type ProductProps = {
  name: String,
  dateAdded: String,
  variants: Number,
  active: Boolean
}

const Product = ({name, dateAdded, variants, active}:ProductProps) => {

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSide}>
        <div className={styles.productImage}>
          &nbsp;
        </div>
        <div className={styles.infoContainer}>
            <h3>{name}</h3>
            <p>{dateAdded}</p>
        </div>
        <div className={styles.variants}>
          <p>{`${variants} Variants`}</p>
        </div>
      </div>
      <div className={styles.rightSide}>
          <div className={active ? styles.activeProduct : styles.disabledProduct}>
            {active ? "Active" : "Disabled"}
          </div>
          <ButtonStd variant='ghost-dark'><EditIcon/></ButtonStd>
          <ButtonStd variant='ghost-dark'><TrashIcon/></ButtonStd>
      </div>
    </div>
  )

}

export default Product