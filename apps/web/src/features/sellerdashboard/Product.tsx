import React from 'react'
import styles from "./Product.module.css"
import ButtonStd from '@/components/UI/ButtonStd'

import TrashIcon from "@/assets/icons/trash-can-solid-full.svg?react"
import EditIcon from "@/assets/icons/pen-to-square-solid-full.svg?react"

type ProductProps = {
  name: string,
  dateAdded: string,
  variants: number,
  active: boolean,
  onEdit?: () => void,
  onToggleActive?: () => void,
  onDelete?: () => void,
}

const Product = ({name, dateAdded, variants, active, onEdit, onToggleActive, onDelete}:ProductProps) => {

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSide}>
        <div className={styles.productImage}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
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
          <button className={active ? styles.activeProduct : styles.disabledProduct} onClick={onToggleActive}>
            {active ? "Active" : "Disabled"}
          </button>
          <ButtonStd variant='ghost-dark' onClick={onEdit}><EditIcon/></ButtonStd>
          <ButtonStd variant='ghost-dark' onClick={onDelete}><TrashIcon/></ButtonStd>
      </div>
    </div>
  )

}

export default Product