import React, { useState, useRef } from 'react'
import styles from './AddProductModal.module.css'
import ButtonStd from '@/components/UI/ButtonStd'

const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const NUMBER_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

interface ProductData {
  name?: string
  description?: string
  selectedSizes?: string[]
  active?: boolean
}

interface AddProductModalProps {
  onClose: () => void
  initialData?: ProductData
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.selectedSizes ?? [])
  const [active, setActive] = useState(initialData?.active ?? false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
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
        </div>

        <div className={styles.footer}>
          <ButtonStd variant="ghost-dark" onClick={onClose}>Cancel</ButtonStd>
          <ButtonStd variant="primary">{initialData ? 'Save' : 'Add Product'}</ButtonStd>
        </div>
      </div>
    </div>
  )
}

export default AddProductModal
