import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductsContainer from "@/features/products/ProductsContainer";
import ProductCard from "@/features/products/ProductCard";
import ProductCategories from "@/features/products/ProductCategories";
import Container from "@/components/containers/Container";
import { getWishlist, toggleWishlist } from "@/api/wishlist";
import { useAuth } from "@/contexts/AuthContext";
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
  const { refreshWishlist } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getWishlist()
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      await toggleWishlist(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      await refreshWishlist();
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  };

  if (isLoading)
    return (
      <Container>
        <p>Loading wishlist...</p>
      </Container>
    );

  return (
    <Container>
      <ProductCategories />
      <h1 style={{ marginBottom: "2rem" }}>My wishlist</h1>

      {products.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            width: "100%",
            textAlign: "center",
            padding: "4rem 2rem",
            gap: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "1.8rem",
              fontWeight: "500",
              color: "#333",
              margin: 0,
            }}
          >
            Your wishlist is empty
          </p>

          <ButtonStd
            onClick={() => navigate("/products")}
            style={{ minWidth: "240px" }}
          >
            Browse products
          </ButtonStd>
        </div>
      ) : (
        <ProductsContainer>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              title={product.name}
              brand={product.category}
              variants={0}
              price={product.price}
              link={`/product/${product._id}`}
              image={product.ProductImage}
              isWishlist={true}
              onRemove={handleRemove}
            />
          ))}
        </ProductsContainer>
      )}
    </Container>
  );
};

export default WishlistPage;
