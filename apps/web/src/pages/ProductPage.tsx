import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import MainContainer from "@/components/ContentWrapper";
import ProductCategories from "@/features/products/ProductCategories";
import ButtonStd from '@/components/ui/ButtonStd';
import ProductView from "@/features/product/ProductView"
import Container from '@/components/containers/Container';

import BackIcon from "@/assets/icons/angle-left-solid-full.svg?react"
import { getProduct } from '@/api/products';

type ProductData = {
  product: {
  _id: string;
  name: string;
  category: string;
  price: number;
  };
  variants: [];
};

const ProductPage = () => {
  const { id } = useParams();
  const [ productData, setProductData ] = useState<ProductData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!id) return;

    getProduct(id).then((result) => {
      setProductData(result);
    });
  }, [id]);

  if(!productData) {
    return <p>Loading ...</p>;
  }

  return (
    <>
      <Container>
        <ProductCategories/>
        <ButtonStd variant="secondary"onClick={() => {navigate(-1);}}>
          <BackIcon/>
        </ButtonStd>
        <ProductView
          product={productData.product}
          variants={productData.variants} />
      </Container>
    </>
  )
}

export default ProductPage