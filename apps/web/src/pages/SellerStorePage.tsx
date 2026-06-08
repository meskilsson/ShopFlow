import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '@/components/containers/Container'
import ProductCard from '@/features/products/ProductCard'
import ProductCategories from '@/features/products/ProductCategories'
import Category from '@/features/products/Category'
import ButtonStd from '@/components/UI/ButtonStd'
import BackIcon from '@/assets/icons/angle-left-solid-full.svg?react'
import styles from './SellerStorePage.module.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1'

type Product = {
  _id: string
  name: string
  price: number
  category: string
  ProductImage?: string
  variants: number
}

type Seller = {
  _id: string
  name: string
  storeName?: string
}

const SellerStorePage = () => {
  const { sellerId } = useParams()
  const navigate = useNavigate()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [byCategory, setByCategory] = useState<Record<string, Product[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sellerId) return
    setLoading(true)
    fetch(`${API_URL}/products/seller/${sellerId}`)
      .then(res => res.json())
      .then(data => {
        setSeller(data.seller)
        setAllProducts(data.products)
        const grouped: Record<string, Product[]> = {}
        for (const product of data.products as Product[]) {
          if (!grouped[product.category]) grouped[product.category] = []
          grouped[product.category].push(product)
        }
        setByCategory(grouped)
      })
      .catch(() => setError('Could not load seller products'))
      .finally(() => setLoading(false))
  }, [sellerId])

  const displayName = seller?.storeName || seller?.name || 'Seller'

  return (
    <Container>
      <ProductCategories />

      <ButtonStd variant="secondary" onClick={() => navigate(-1)}>
        <BackIcon />
      </ButtonStd>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <p className={styles.soldBy}>Sold by {displayName}</p>
          <Category categoryText="All products" articles={allProducts.length} />

          {allProducts.length === 0 && (
            <p className={styles.empty}>This seller has no active products.</p>
          )}

          <section className={styles.section}>
            <div className={styles.grid}>
              {allProducts.map(product => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.name}
                  brand={product.category}
                  variants={product.variants}
                  price={product.price}
                  image={product.ProductImage}
                  link={`/product/${product._id}`}
                />
              ))}
            </div>
          </section>

          {Object.keys(byCategory).length > 0 && <div className={styles.divider} />}

          {Object.entries(byCategory).map(([category, products]) => (
            <section key={category} className={styles.section}>
              <h2 className={styles.categoryHeading}>{category}</h2>
              <div className={styles.grid}>
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    title={product.name}
                    brand={category}
                    variants={product.variants}
                    price={product.price}
                    image={product.ProductImage}
                    link={`/product/${product._id}`}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </Container>
  )
}

export default SellerStorePage
