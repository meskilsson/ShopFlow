import React from 'react'
import styles from "./NavBar.module.css"

const navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <h2>ShopFlow</h2>
      </div>
    </div>
  )
}

export default navbar