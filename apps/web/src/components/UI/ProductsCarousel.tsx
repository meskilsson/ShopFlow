import { useRef, useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"
import styles from "./ProductsCarousel.module.css"

interface ProductCarouselProps {
  children: ReactNode
  title?: string
}

const CARD_WIDTH = 174
const CARD_GAP = 16
const STEP = CARD_WIDTH + CARD_GAP

const ProductCarousel = ({ children, title }: ProductCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateButtons = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateButtons()
    el.addEventListener("scroll", updateButtons, { passive: true })
    const ro = new ResizeObserver(updateButtons)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateButtons)
      ro.disconnect()
    }
  }, [updateButtons])

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -STEP : STEP, behavior: "smooth" })
  }

  return (
    <section className={styles.carousel}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.controls}>
            <button
              className={styles.btn}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className={styles.btn}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className={styles.wrapper}>
        {!title && (
          <button
            className={`${styles.sideBtn} ${styles.sideBtnLeft}`}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className={styles.track} ref={trackRef}>
          {children}
        </div>

        {!title && (
          <button
            className={`${styles.sideBtn} ${styles.sideBtnRight}`}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}

export default ProductCarousel