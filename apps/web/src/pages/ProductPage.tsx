import React from 'react'
import { useNavigate } from 'react-router-dom'

import MainContainer from "../components/containers/MainContainer";
import NavBar from "../components/ui/features/navbar/NavBar"
import ProductCategories from "../components/ui/features/products/ProductCategories";
import ButtonStd from '@/components/ui/ButtonStd';
import ProductView from "@/components/ui/features/product/ProductView"

import BackIcon from "@/assets/icons/angle-left-solid-full.svg?react"

const ProductPage = () => {
  const navigate = useNavigate();

  return (
    <>
        {/* <NavBar/> */}
        <MainContainer>
            <ProductCategories/>
            <ButtonStd variant="secondary"onClick={() => {navigate(-1);}}>
              <BackIcon/>
            </ButtonStd>
            <ProductView/>
        </MainContainer>
    </>
  )
}

export default ProductPage