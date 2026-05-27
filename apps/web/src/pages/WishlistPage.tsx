import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductsContainer from "@/features/products/ProductsContainer";
import ProductCard from "@/features/products/ProductCard";
import ProductCategories from "@/features/products/ProductCategories";
import Container from "@/components/containers/Container";
import { getWishlist } from "@/api/wishlist";
import ButtonStd from "@/components/UI/ButtonStd";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  ProductImage?: string;
};

const WishlistPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getWishlist()
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return (
      <Container>
        <p>Laddar önskelista...</p>
      </Container>
    );

  return (
    <Container>
      <ProductCategories />
      <h1 style={{ marginBottom: "2rem" }}>Min önskelista</h1>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p>Din önskelista är tom.</p>
          <ButtonStd onClick={() => navigate("/products")}>
            Bläddra bland produkter
          </ButtonStd>
        </div>
      ) : (
        <ProductsContainer>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              title={product.name}
              brand={product.category}
              variants={0}
              price={product.price}
              link={`/product/${product._id}`}
              image={product.ProductImage}
            />
          ))}
        </ProductsContainer>
      )}
    </Container>
  );
};

export default WishlistPage;
