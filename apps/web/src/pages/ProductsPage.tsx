import React from 'react'
import { useNavigate } from 'react-router-dom'

import MainContainer from "@/components/containers/MainContainer";
import ProductsContainer from "@/features/products/ProductsContainer"
import NavBar from "@/features/navbar/NavBar"
import ProductCard from "@/features/products/ProductCard"
import Category from "@/features/products/Category"
import ProductCategories from "@/features/products/ProductCategories";

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