import React from 'react'
import styles from "./StatCard.module.css"

interface StatCardProps {
    title: string;
    statistic: number;
    measurement?: string;
}

const StatCard = ({title, statistic, measurement}: StatCardProps) => {
  return (
    <div className={styles.card}>
        <h2>{title}</h2>
        <p>{statistic}{measurement ? ` ${measurement}` : ""}</p>
    </div>
  )
}

export default StatCard