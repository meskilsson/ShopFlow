import React from 'react'
import { useNavigate } from 'react-router-dom'

import ProductCategories from "@/features/products/ProductCategories";
import ButtonStd from '@/components/ui/ButtonStd';
import Container from '@/components/containers/Container';
import Hero from '@/components/ui/Hero';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <ProductCategories/>
        <Hero title="SUMMER TIME" subtitle="Is your wardrobe up to date?" image="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></Hero>
      </Container>
    </>
  )
}

export default HomePage