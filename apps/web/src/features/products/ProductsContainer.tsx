import styles from "./ProductsContainer.module.css"

type Props = {
  children: React.ReactNode
}

const ProductsContainer = ({ children }: Props) => {
  return (
    <section className={styles.container}>
      {children}
    </section>
  )
}

export default ProductsContainer