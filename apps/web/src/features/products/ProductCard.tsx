import { Link } from "react-router-dom"
import styles from "./ProductCard.module.css"

import ProductImage from "@/assets/1.webp"

interface ProductCardProps {
  title: string
  brand: string
  variants: number
  price: number
  link: string
  image: string
}

const ProductCard = ({
  title,
  brand,
  variants,
  price,
  link,
  image
}: ProductCardProps) => {
  return (
    <Link to={link} className={styles.card}>
      
      <div className={styles.imageWrapper}>
        <img src={ProductImage} alt={title} className={styles.productImage} />
      </div>

      <div className={styles.productInfo}>
        <p className={styles.productTitle}>{title}</p>
        <p className={styles.productBrand}>{brand}</p>

        <div className={styles.metaRow}>
          <span className={styles.productVariants}>
            {variants} variants
          </span>
          <span className={styles.productPrice}>
            {price} kr
          </span>
        </div>
      </div>

    </Link>
  )
}

export default ProductCard