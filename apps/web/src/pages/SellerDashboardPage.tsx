import React, { useState } from 'react'

import Styles from "./SellerDashboard.module.css"

import Container from '@/components/containers/Container';

import SellerInfo from '@/features/sellerdashboard/SellerInfo';
import Statistics from '@/features/sellerdashboard/Statistics';
import ProductsView from '@/features/sellerdashboard/ProductsView';

const SellerDashboardPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <Container>
        <h1 className={Styles.header}>Seller Dashboard</h1>
        <SellerInfo/>
        <Statistics refreshTrigger={refreshTrigger}/>
        <ProductsView onProductsChanged={() => setRefreshTrigger(c => c + 1)}/>
    </Container>
  )
}

export default SellerDashboardPage
