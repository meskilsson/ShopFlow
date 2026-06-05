import React, { useState, useRef } from 'react'
import styles from './AddProductModal.module.css'
import ButtonStd from '@/components/UI/ButtonStd'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1'

const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const NUMBER_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
const CATEGORIES = ['T-shirts', 'Shoes', 'Pants', 'Shirts', 'Jackets', 'Accessories'] as const

interface ProductData {
  _id?: string
  name?: string
  price?: number
  category?: string
  description?: string
  selectedSizes?: string[]
  initialVariants?: { _id: string; size: string }[]
  active?: boolean
  ProductImage?: string
}

interface AddProductModalProps {
  onClose: () => void
  onSuccess?: () => void
  initialData?: ProductData
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSuccess, initialData }) => {
  const [name, setName] = useState(initialData?.name ?? '')
  const [price, setPrice] = useState<number | ''>(initialData?.price ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.selectedSizes ?? [])
  const [active, setActive] = useState(initialData?.active ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.ProductImage ?? null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)

    const res = await fetch(`${API_URL}/products/upload-image`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? 'Image upload failed')
    return data.url as string
  }

  async function postVariants(productId: string, sizes: string[]): Promise<string[]> {
    if (sizes.length === 0) return []
    const results = await Promise.allSettled(
      sizes.map(size =>
        fetch(`${API_URL}/products/${productId}/variants`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ size, inStock: true }),
        }).then(async r => {
          if (!r.ok) {
            const d = await r.json()
            throw new Error(d.message ?? `Failed to add size ${size}`)
          }
        })
      )
    )
    return results
      .map((result, i) => ({ result, size: sizes[i] }))
      .filter(({ result }) => result.status === 'rejected')
      .map(({ size }) => size)
  }

  async function handleSubmit() {
    setError(null)

    if (!name.trim()) { setError('Product name is required'); return }
    if (!price || price <= 0) { setError('Price must be greater than 0'); return }
    if (!category) { setError('Please select a category'); return }

    setIsSubmitting(true)

    try {
      let productImageUrl: string | undefined
      if (imageFile) {
        productImageUrl = await uploadImage(imageFile)
      }

      const isEditing = !!initialData?._id

      const body = {
        name,
        price,
        category,
        ...(description.trim() && { description: description.trim() }),
        active,
        ...(productImageUrl !== undefined && { ProductImage: productImageUrl }),
      }

      const res = await fetch(
        isEditing ? `${API_URL}/products/${initialData!._id}` : `${API_URL}/products`,
        {
          method: isEditing ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? (isEditing ? 'Failed to update product' : 'Failed to create product'))

      const productId = isEditing ? initialData!._id! : data._id

      let failedSizes: string[] = []

      if (isEditing) {
        const originalVariants = initialData?.initialVariants ?? []
        const originalSizes = new Set(originalVariants.map(v => v.size))
        const currentSizes = new Set(selectedSizes)

        const toDelete = originalVariants.filter(v => !currentSizes.has(v.size))
        await Promise.allSettled(
          toDelete.map(v =>
            fetch(`${API_URL}/products/variants/${v._id}`, {
              method: 'DELETE',
              credentials: 'include',
            })
          )
        )

        const toAdd = selectedSizes.filter(s => !originalSizes.has(s))
        failedSizes = await postVariants(productId, toAdd)
      } else {
        failedSizes = await postVariants(productId, selectedSizes)
      }

      onSuccess?.()

      if (failedSizes.length > 0) {
        setError(`Product saved, but failed to add sizes: ${failedSizes.join(', ')}`)
        return
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{initialData ? 'Edit Product' : 'Add Product'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <label className={styles.label}>
            Product Name
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Running Shoes"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Price
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 49.99"
              min="0.01"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
          </label>

          <label className={styles.label}>
            Category
            <select
              className={styles.select}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={styles.textarea}
              placeholder="Describe the product..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </label>

          <div className={styles.label}>
            Available Sizes
            <div className={styles.sizeGrid}>
              <button
                className={`${styles.sizeChip} ${selectedSizes.includes('One Size') ? styles.sizeChipActive : ''}`}
                onClick={() => toggleSize('One Size')}
                type="button"
              >
                One Size
              </button>
            </div>
            <div className={styles.sizeGrid}>
              {LETTER_SIZES.map(size => (
                <button
                  key={size}
                  className={`${styles.sizeChip} ${selectedSizes.includes(size) ? styles.sizeChipActive : ''}`}
                  onClick={() => toggleSize(size)}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
            <div className={styles.sizeGrid}>
              {NUMBER_SIZES.map(size => (
                <button
                  key={size}
                  className={`${styles.sizeChip} ${selectedSizes.includes(size) ? styles.sizeChipActive : ''}`}
                  onClick={() => toggleSize(size)}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.toggleRow}>
            <span className={styles.label} style={{ margin: 0 }}>Active</span>
            <button
              type="button"
              className={`${styles.toggle} ${active ? styles.toggleOn : ''}`}
              onClick={() => setActive(prev => !prev)}
              aria-pressed={active}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>

          <div className={styles.label}>
            Product Image
            <div
              className={styles.imageUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                : <span className={styles.imageUploadPlaceholder}>Click to upload image</span>
              }
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>

          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <ButtonStd variant="ghost-dark" onClick={onClose} disabled={isSubmitting}>Cancel</ButtonStd>
          <ButtonStd variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Save' : 'Add Product'}
          </ButtonStd>
        </div>
      </div>
    </div>
  )
}

export default AddProductModal
