import { useState, useEffect } from "react";
import styles from "./ProductView.module.css";
import FallbackProductImage from "@/assets/1.webp";
import HeartIconRegular from "@/assets/icons/heart-regular-full.svg?react";
import HeartIconSolid from "@/assets/icons/heart-solid-full.svg?react";
import Line from "@/assets/icons/line.svg?react";
import ButtonStd from "@/components/UI/ButtonStd";
import Card from "@/components/UI/Card";
import { addToCart } from "@/api/cart";
import { toggleWishlist } from "@/api/wishlist";
import { useAuth } from "@/contexts/AuthContext";

type ProductVariant = {
  _id: string;
  product: string;
  color: string;
  size: string;
  inStock?: boolean;
  sku?: string;
};

type ProductViewProps = {
  product: {
    _id: string;
    name: string;
    category: string;
    price: number;
    rating?: number;
    seller?: string;
    ProductImage?: string;
  };
  variants: ProductVariant[];
};

const ProductView = ({ product, variants }: ProductViewProps) => {
  const { isAuthenticated } = useAuth();
  const [cartMessage, setCartMessage] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((variant) => variant.inStock !== false)?._id ?? null,
  );
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    import("@/api/wishlist")
      .then(({ getWishlist }) => getWishlist())
      .then((wishlist) => {
        const alreadyInWishlist = wishlist.some(
          (p: any) => p._id === product._id,
        );
        setIsInWishlist(alreadyInWishlist);
      })
      .catch(() => {});
  }, [isAuthenticated, product._id]);

  async function handleToggleWishlist() {
    if (!isAuthenticated) {
      alert("Logga in för att spara i önskelistan.");
      return;
    }

    try {
      const result = await toggleWishlist(product._id);
      setIsInWishlist(result.inWishlist);
    } catch (error) {
      console.error("Wishlist toggle failed", error);
    }
  }

  async function handleAddToCart() {
    if (!selectedVariantId) {
      setCartMessage("Choose a size and color first");
      return;
    }

    try {
      await addToCart(selectedVariantId, 1);
      setCartMessage("Item added to cart");

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    } catch {
      setCartMessage("Could not add item to cart");
    }
  }

  const HeartIcon = isInWishlist ? HeartIconSolid : HeartIconRegular;

  return (
    <section className={styles.productContainer}>
      <img
        src={product.ProductImage || FallbackProductImage}
        alt={product.name}
        className={styles.productImage}
      />

      <div className={styles.sidebar}>
        <Card>
          <div className={styles.productInfo}>
            <h2 className={styles.productBrand}>{product.category}</h2>
            <h1 className={styles.productTitle}>{product.name}</h1>
            {product.rating ? (
              <p className={styles.productRating}>
                Rating: {product.rating}/5 ⭐
              </p>
            ) : null}
            <p className={styles.productPrice}>
              {product.price} kr <span className={styles.vat}>incl. VAT</span>
            </p>
          </div>

          <div className={styles.variantDiv}>
            <p>Choose your size</p>
            <div className={styles.variantList}>
              {variants.map((variant) => (
                <ButtonStd
                  variant="border"
                  className={
                    selectedVariantId === variant._id
                      ? styles.borderSelected
                      : ""
                  }
                  key={variant._id}
                  disabled={!variant.inStock}
                  onClick={() => setSelectedVariantId(variant._id)}
                >
                  {variant.size}
                  {!variant.inStock ? (
                    <Line className={styles.disabledIcon} />
                  ) : null}
                </ButtonStd>
              ))}
            </div>

            {selectedVariantId ? (
              <p className={styles.variantMeta}>
                {
                  variants.find((variant) => variant._id === selectedVariantId)
                    ?.color
                }
              </p>
            ) : null}
          </div>

          <div className={styles.buttonContainer}>
            <ButtonStd variant="primary" fullWidth onClick={handleAddToCart}>
              Add to cart
            </ButtonStd>

            <ButtonStd
              variant="ghost-dark"
              onClick={handleToggleWishlist}
              style={{ cursor: "pointer" }}
            >
              <HeartIcon className={styles.buttonIcon} />
            </ButtonStd>
          </div>

          {cartMessage ? (
            <div className={styles.cartMessage}>{cartMessage}</div>
          ) : null}
        </Card>

        <Card>
          <h2 className={styles.sellerInfo}>
            This product is sold by{" "}
            <span className={styles.seller}>
              {product.seller || "ShopFlow"}
            </span>
          </h2>
        </Card>

        <Card>
          <p className={styles.commentsText}>Comments:</p>
          <section className={styles.comment}>{/* comments... */}</section>
        </Card>
      </div>
    </section>
  );
};

export default ProductView;
