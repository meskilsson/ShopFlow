import { useNavigate, useParams } from 'react-router-dom'

import ProductsContainer from "@/features/products/ProductsContainer"
import ProductCard from "@/features/products/ProductCard"
import Category from "@/features/products/Category"
import ProductCategories from "@/features/products/ProductCategories";
import Container from '@/components/containers/Container';
import { useEffect, useState } from 'react';
import { getProducts } from '@/api/products';

type Product = {
    _id: string;
    name: string;
    category: string;
    price: number;
};

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() =>  {
        getProducts().then((result) => {
            setProducts(result.data);
        });
    }, []);
    const navigate = useNavigate();

    return (
        <Container>
            <ProductCategories/>
            <Category categoryText="Shoes" articles={products.length}/>
            <ProductsContainer>
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        title={product.name}
                        brand={product.category}
                        variants="1"
                        price={String(product.price)}
                        link={`/product/${product._id}`}
                    />
                ))}
            </ProductsContainer>
        </Container>
    )
    }

export default ProductsPage
