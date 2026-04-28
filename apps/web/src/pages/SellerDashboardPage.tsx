import React from 'react'
import { useNavigate } from 'react-router-dom'

import ButtonStd from '@/components/UI/ButtonStd';
import Container from '@/components/containers/Container';

import Statistics from '@/features/sellerdashboard/Statistics';
import ProductsView from '@/features/sellerdashboard/ProductsView';

const SellerDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
 
        <Statistics/>
        <ProductsView/>
        
    </Container>
  )
}

export default SellerDashboardPage
