import React, { useEffect, useState } from 'react'
import styles from "./Statistics.module.css"

import StatCard from './StatCard'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1'

type Props = { refreshTrigger?: number }

const Statistics = ({ refreshTrigger = 0 }: Props) => {
  const [total, setTotal] = useState(0)
  const [active, setActive] = useState(0)
  const [disabled, setDisabled] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/products/mine`, { credentials: 'include' })
      .then(res => res.json())
      .then(products => {
        if (!Array.isArray(products)) return
        setTotal(products.length)
        setActive(products.filter((p: { active: boolean }) => p.active).length)
        setDisabled(products.filter((p: { active: boolean }) => !p.active).length)
      })
      .catch(() => {})
  }, [refreshTrigger])

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.subHeader}>Statistics</h2>
      <div className={styles.statsContainer}>
        <StatCard title='Total' statistic={total} measurement='products' />
        <StatCard title='Active' statistic={active} measurement='products' />
        <StatCard title='Disabled' statistic={disabled} measurement='products' />
      </div>
    </section>
  )
}

export default Statistics
