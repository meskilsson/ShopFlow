import React from 'react'
import { useNavigate } from 'react-router-dom'

import MainContainer from "../components/Containers/MainContainer";
import ProductsContainer from "../components/Containers/ProductsContainer"
import NavBar from "../components/UI/Navigation/NavBar"
import ProductCard from "../components/ProductCard"
import Category from "../components/UI/Category"
import ProductCategories from "../components/UI/Navigation/ProductCategories";
import Banner from "../components/UI/Banner";

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