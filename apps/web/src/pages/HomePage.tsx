import React from 'react'
import { useNavigate } from 'react-router-dom'

import ProductCategories from "@/features/products/ProductCategories";
import ButtonStd from '@/components/UI/ButtonStd';
import Container from '@/components/containers/Container';
import Hero from '@/components/UI/Hero';
import ProductsContainer from "@/features/products/ProductsContainer"
import ProductCard from '@/features/products/ProductCard';
import Category from '@/features/products/Category';
import MainHero from "@/features/home/MainHero"

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
    {/* <ProductCategories/> */}
    <MainHero fullWidth title="SUMMER TIME" subtitle="Is your wardrobe up to date?" image="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></MainHero>
      <Container>

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
        </ProductsContainer>

        <Category categoryText="Pants" articles={666}/>
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
        </ProductsContainer>
      </Container>
    </>
  )
}

export default HomePage