import React from 'react'
import styles from "./SearchBar.module.css"

import SearchIcon from "@/assets/icons/magnifying-glass-solid-full.svg?react"

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
        <SearchIcon className={styles.icon}/>
        <input className={styles.inputField} type="text" placeholder='Search...'/>
    </div>
  )
}

export default SearchBar