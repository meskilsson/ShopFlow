import styles from './NoImagePlaceholder.module.css'

import type { CSSProperties } from 'react'

type Props = {
  className?: string
  style?: CSSProperties
}

const NoImagePlaceholder = ({ className = '', style }: Props) => (
  <div className={`${styles.placeholder} ${className}`} style={style}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
    <span className={styles.label}>No image</span>
  </div>
)

export default NoImagePlaceholder
