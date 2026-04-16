import React from 'react'
import styles from "./SurfaceBlock.module.css"

type Props = {
  children: React.ReactNode;
  noBackground?: boolean
};

const SurfaceBlock = ({children, noBackground = false}: Props) => {
  return (
    <div className={`${styles.surfaceBlock} ${noBackground ? styles.noBg : ""}`} >
        {children}
    </div>
  )
}

export default SurfaceBlock