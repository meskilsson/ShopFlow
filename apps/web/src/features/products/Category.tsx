import React from 'react'
import styles from "./Category.module.css"
import ButtonStd from '@/components/ui/ButtonStd'

type Props = {
    categoryText: string,
    articles: number
}

const Category = ({categoryText, articles}: Props) => {
  return (
    <>
      {/* <p className={styles.articles}>{articles} articles</p> */}
      <section className={styles.container}>
        <div className={styles.category}>
            <h1>{categoryText}</h1>
        </div>
        {/* <div>
          <ButtonStd variant="ghost-dark">Filter</ButtonStd>
        </div> */}
      </section>
    </>
  )
}

export default Category