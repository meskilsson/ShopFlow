import React from 'react'
import { useNavigate } from 'react-router-dom'

import MainContainer from "@/components/ContentWrapper";
import ProductCategories from "@/features/products/ProductCategories";
import ButtonStd from '@/components/UI/ButtonStd';
import ProductView from "@/features/product/ProductView"
import Container from '@/components/containers/Container';

import ButtonStd from '@/components/UI/ButtonStd';
import BackIcon from "@/assets/icons/angle-left-solid-full.svg?react"

const ProductPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <ProductCategories/>
        <ButtonStd variant="secondary"onClick={() => {navigate(-1);}}>
          <BackIcon/>
        </ButtonStd>
        <ProductView/>
      </Container>
    </>
  )
}

export default ProductPage
