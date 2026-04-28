import React from 'react'
import styles from "./Statistics.module.css"

import Card from '@/components/UI/Card'
import StatCard from './StatCard'
import Container from '@/components/containers/Container'

const Statistics = () => {
  return (

    <section className={styles.wrapper}>
        <h2 className={styles.subHeader}>Statistics</h2>
        <div className={styles.statsContainer}>
            <StatCard title='Active' statistic={40} measurement='products'/>
            <StatCard title='Disabled' statistic={4} measurement='products'/>
            <StatCard title='Products Sold' statistic={78} measurement='pcs'/>
            <StatCard title='Revenue' statistic={6095} measurement='kr'/>
            {/* <StatCard title='Test' statistic={400} measurement='orders'/> */}
        </div>
    </section>
  )
}

export default Statistics