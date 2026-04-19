import React from 'react'
import { useNavigate } from 'react-router-dom'

import MainContainer from "../components/containers/MainContainer";
import ProductsContainer from "../components/ui/features/products/ProductsContainer"
import NavBar from "../components/ui/features/navbar/NavBar"
import ProductCard from "../components/ui/features/products/ProductCard"
import Category from "../components/ui/Category"
import ProductCategories from "../components/ui/features/products/ProductCategories";
import Banner from "../components/ui/features/products/Banner";

const ProductsPage = () => {
  const navigate = useNavigate();

  return (
    <>
        {/* <NavBar/> */}
        {/* <MainContainer> */}
            <ProductCategories/>
            <Category categoryText="Shoes" articles={666}/>
            <ProductsContainer>
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
                <ProductCard
                    title="DUNK LOW RETRO"
                    brand="Nike Sportswear"
                    variants="1"
                    price="1200"
                    link="/product"
                />
            </ProductsContainer>
        {/* </MainContainer> */}
    </>
  )
}

export default ProductsPage