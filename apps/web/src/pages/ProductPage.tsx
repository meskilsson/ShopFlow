import React from 'react'
import { useNavigate } from 'react-router-dom'

import MainContainer from "../components/Containers/MainContainer";
import NavBar from "../components/UI/Navigation/NavBar"
import ProductCategories from "../components/UI/Navigation/ProductCategories";
import ButtonStd from '@/components/UI/ButtonStd';
import ProductView from "@/components/UI/Navigation/ProductView"

import BackIcon from "@/assets/icons/angle-left-solid-full.svg?react"

const ProductPage = () => {
  const navigate = useNavigate();

  return (
    <>
        {/* <NavBar/> */}
        <MainContainer>
            <ProductCategories/>
            <ButtonStd variant="secondary" text={<BackIcon/>} onClick={() => {
                navigate(-1);
            }}/>
            <ProductView/>
        </MainContainer>
    </>
  )
}

export default ProductPage