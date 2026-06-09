import React, { useState, useEffect, useCallback } from 'react'
import Product from './Product'
import styles from "./ProductsView.module.css"

import ButtonStd from '@/components/UI/ButtonStd'
import AddProductModal from './AddProductModal'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1'

type SellerProduct = {
  _id: string
  name: string
  price: number
  category: string
  description?: string
  active: boolean
  ProductImage?: string
  createdAt: string
  variants: number
  selectedSizes?: string[]
  initialVariants?: { _id: string; size: string }[]
}

type Props = { onProductsChanged?: () => void }

const ProductsView = ({ onProductsChanged }: Props) => {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null)
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/products/mine`, { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Failed to load products')
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function handleToggleActive(product: SellerProduct) {
    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product.active }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message ?? 'Failed to update product')
      }
      setProducts(prev =>
        prev.map(p => p._id === product._id ? { ...p, active: !p.active } : p)
      )
      onProductsChanged?.()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleEdit(product: SellerProduct) {
    try {
      const res = await fetch(`${API_URL}/products/${product._id}/variants`, { credentials: 'include' })
      const variants = await res.json()
      const initialVariants: { _id: string; size: string }[] = Array.isArray(variants)
        ? variants.map((v: { _id: string; size: string }) => ({ _id: v._id, size: v.size }))
        : []
      setEditingProduct({ ...product, selectedSizes: initialVariants.map(v => v.size), initialVariants })
    } catch {
      setEditingProduct({ ...product, selectedSizes: [], initialVariants: [] })
    }
  }

  async function handleDelete(product: SellerProduct) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message ?? 'Failed to delete product')
      }
      setProducts(prev => prev.filter(p => p._id !== product._id))
      onProductsChanged?.()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <h2 className={styles.subHeader}>Product Listings</h2>
      <ButtonStd onClick={() => setShowModal(true)}>Add Product</ButtonStd>
      <section className={styles.wrapper}>
        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', padding: '1rem 0' }}>
            No products yet. Add your first product above.
          </p>
        )}
        {products.map(product => (
          <Product
            key={product._id}
            name={product.name}
            dateAdded={new Date(product.createdAt).toLocaleDateString()}
            variants={product.variants}
            active={product.active}
            onEdit={() => handleEdit(product)}
            onToggleActive={() => handleToggleActive(product)}
            onDelete={() => handleDelete(product)}
          />
        ))}
      </section>
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { fetchProducts(); onProductsChanged?.() }}
        />
      )}
      {editingProduct && (
        <AddProductModal
          initialData={{
            _id: editingProduct._id,
            name: editingProduct.name,
            price: editingProduct.price,
            category: editingProduct.category,
            description: editingProduct.description,
            active: editingProduct.active,
            ProductImage: editingProduct.ProductImage,
            selectedSizes: editingProduct.selectedSizes ?? [],
            initialVariants: editingProduct.initialVariants ?? [],
          }}
          onClose={() => setEditingProduct(null)}
          onSuccess={fetchProducts}
        />
      )}
    </>
  )
}

export default ProductsView
