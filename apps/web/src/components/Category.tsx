import React from 'react'
import styles from "./Category.module.css"

type Props = {
    categoryText: string,
    articles: number
}

const Category = ({categoryText, articles}: Props) => {
  return (
    <div className={styles.category}>
        <p className={styles.articles}>{articles} articles</p>
        <h1>{categoryText}</h1>
    </div>
  )
}

export default Category