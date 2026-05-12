import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import kattarpImage1 from '@/assets/images/kattarp/16_cowboy.png';
import kattarpImage2 from '@/assets/images/kattarp/09_surfer.png';
import kattarpImage3 from '@/assets/images/kattarp/03_golf_a.png';

import ProductCategories from "@/features/products/ProductCategories";
import ButtonStd from '@/components/UI/ButtonStd';
import Container from '@/components/containers/Container';
import Hero from '@/components/UI/Hero';
import ProductsContainer from "@/features/products/ProductsContainer"
import ProductCard from '@/features/products/ProductCard';
import Category from '@/features/products/Category';
import MainHero from "@/features/home/MainHero"
import ProductsCarousel from '@/components/UI/ProductsCarousel';
import { getProducts } from '@/api/products';

type Product = {
    _id: string;
    name: string;
    category: string;
    price: number;
    variants: number;
    ProductImage?: string;
};

const HomePage = () => {
    const [shoes, setShoes] = useState<Product[]>([])
    const [tshirts, setTshirts] = useState<Product[]>([])

    useEffect(() =>  {
        getProducts("Shoes").then((result) => {
            setShoes(result.data);
        });
    }, []);

    useEffect(() =>  {
        getProducts("T-shirts").then((result) => {
            setTshirts(result.data);
        });
    }, []);
    const navigate = useNavigate();

  return (
    <>
    {/* <ProductCategories/> */}
    <MainHero fullWidth title="SUMMER TIME" subtitle="Is your wardrobe up to date?" image="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></MainHero>
      <Container>

        <Category categoryText="Shoes" articles={shoes.length}/>
        <div style={{margin: "0 auto", marginBottom: "1rem"}}>
            <ProductsCarousel>
                {shoes.map((product) => (
                    <ProductCard
                        key={product._id}
                        title={product.name}
                        brand={product.category}
                        variants={product.variants}
                        price={(product.price)}
                        link={`/product/${product._id}`}
                        image={product.ProductImage}
                    /> ))}
                
            </ProductsCarousel>

        </div>

        <Category categoryText="T-Shirts" articles={tshirts.length}/>
        <div style={{margin: "0 auto", marginBottom: "1rem"}}>
            <ProductsCarousel>
                {tshirts.map((product) => (
                    <ProductCard
                        key={product._id}
                        title={product.name}
                        brand={product.category}
                        variants={product.variants}
                        price={(product.price)}
                        link={`/product/${product._id}`}
                        image={product.ProductImage}
                    /> ))}
                
            </ProductsCarousel>

        </div>

        <Hero title="THE KATTARP COLLECTION" subtitle="Fashion fades. Legends multiply." image={kattarpImage1} image2={kattarpImage2} image3={kattarpImage3} textBesideImage description='From cowboy outlaw to disco king, mountain climber to synth wizard — our latest collection is inspired by the many dangerously confident versions of our legendary teacher. Every outfit captures a different chaotic persona, balanced perfectly between action movie energy and complete fashion madness.

This isn’t just clothing.
It’s an identity crisis with premium materials.'>
            <div style={{marginTop: "1rem"}}></div>
            <ButtonStd variant='ghost-dark'>Check it out now</ButtonStd>
        </Hero>
        
      </Container>
    </>
  )
}

export default HomePage
