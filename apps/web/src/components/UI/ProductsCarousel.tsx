import React, { useRef } from "react"
import styles from "./ProductsCarousel.module.css"

type Props = {
  children: React.ReactNode
}

const ProductsCarousel = ({ children }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 174 + 24 // card + gap

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={() => scroll("left")} className={styles.button}>
        ◀
      </button>

      <div className={styles.viewport}>
        <div ref={scrollRef} className={styles.track}>
          {children}
        </div>
      </div>

      <button onClick={() => scroll("right")} className={styles.button}>
        ▶
      </button>
    </div>
  )
}

export default ProductsCarousel