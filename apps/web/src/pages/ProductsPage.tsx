import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import ProductsContainer from "@/features/products/ProductsContainer"
import ProductCard from "@/features/products/ProductCard"
import Category from "@/features/products/Category"
import ProductCategories from "@/features/products/ProductCategories";
import Container from '@/components/containers/Container';
import { useEffect, useState } from 'react';
import { getProducts } from '@/api/products';
import ButtonStd from '@/components/UI/ButtonStd';

type Product = {
    _id: string;
    name: string;
    category: string;
    price: number;
    variants: number;
    ProductImage?: string;
};

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") ?? undefined;

    const navigate = useNavigate();

    useEffect(() =>  {
        getProducts(category, 1).then((result) => {
            setProducts(result.data);
            setTotalPages(result.meta.totalPages);
            setPage(result.meta.page)
        });
    }, [category]);

        async function handleLoadMore(){
        const nextPage = page + 1;
        const result = await getProducts(category, nextPage);

        setProducts((prev) => [...prev, ...result.data]);
        setTotalPages(result.meta.totalPages);
        setPage(result.meta.page);

    }

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
                        variants={product.variants}
                        price={(product.price)}
                        link={`/product/${product._id}`}
                        image={product.ProductImage}
                    />
                ))}

                {page < totalPages && (
                    <ButtonStd onClick={handleLoadMore}>
                        Load more
                    </ButtonStd>
            )}
            </ProductsContainer>
        </Container>
        
    )
    }

export default ProductsPage
