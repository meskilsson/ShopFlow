import React from 'react'
import styles from "./Banner.module.css"

const Banner = () => {

    const containerStyle: React.CSSProperties = {
        width: "100%",
        backgroundColor: "#D43B3B",
        color: "white",
        height: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    }

    const textStyle: React.CSSProperties = {
        whiteSpace: "nowrap",
        display: "inline-block",
        paddingLeft: "100%",
        animation: "scrollText 30s linear infinite"
    }

  return (
    <div className={styles.container}>
        <div className={styles.text}>
            Check out our new KATTARP-Collection now! 👘
  
        </div>
    </div>
  )
}

export default Banner