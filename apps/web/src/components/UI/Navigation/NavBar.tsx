import React from 'react'
import styles from "./NavBar.module.css"
import HeartIcon from "@/assets/icons/heart-solid-full.svg?react"
import CartIcon from "@/assets/icons/cart-shopping-solid-full.svg?react"
import ProfileIcon from "@/assets/icons/circle-user-solid-full.svg?react"

const navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <h2>ShopFlow</h2>
        <div className={styles.iconContainer}>
          <a className={styles.iconBtn}><ProfileIcon className={styles.icon}/></a>
          <a className={styles.iconBtn}><HeartIcon className={styles.icon}/></a>
          <a className={styles.iconBtn}><CartIcon className={styles.icon}/></a>
        </div>
      </div>
    </div>
  )
}

export default navbar