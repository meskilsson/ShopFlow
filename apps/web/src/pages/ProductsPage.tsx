import { useNavigate } from 'react-router-dom'

import ProductsContainer from "@/features/products/ProductsContainer"
import ProductCard from "@/features/products/ProductCard"
import Category from "@/features/products/Category"
import ProductCategories from "@/features/products/ProductCategories";
import Container from '@/components/containers/Container';

const ProductsPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
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
    </Container>
  )
}

export default ProductsPage