import styles from "./ProductView.module.css"

import ProductImage from "@/assets/1.webp"
import HeartIconStd from "@/assets/icons/heart-regular-full.svg?react"
import Line from "@/assets/icons/line.svg?react"

import ButtonStd from "@/components/UI/ButtonStd"
import Card from "@/components/UI/Card"
import { useState } from "react"
// import CommentCard from '@/components/CommentCard'
import { addToCart } from "@/api/cart";

type ProductVariant = {
  _id: string;
  product: string;
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
  const [cartMessage, setCartMessage] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((variant) => variant.inStock !== false)?._id ?? null,
  );
  
  // Handler for addToCart
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
  } catch (error) {
    setCartMessage("Could not add item to cart");
  }
}

  const comments = [
    {
      user: "Chas-Robin",
      comment: "Love these boots!",
      date: "14 April 2026",
      rating: 4,
      imageUrl: "https://i.pravatar.cc/100?img=22",
    },
    {
      user: "Marcus",
      comment: "Livets dojjor",
      date: "14 April 2026",
      rating: 5,
      imageUrl: "https://i.pravatar.cc/100?img=2",
    },
    {
      user: "Pontus",
      comment: "Jag fick bara en 😟",
      date: "14 April 2026",
      rating: 1,
      imageUrl: "https://i.pravatar.cc/100?img=1",
    },
  ];

  return (
    <section className={styles.productContainer}>
    <img src={product.ProductImage} className={styles.productImage} />

      <div className={styles.sidebar}>
        {/* Main product*/}
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

          <div>
            <p>Variants:</p>
            {variants.map((variant) => (
              <button
                className={styles.variantBtn}
                key={variant._id}
                disabled={!variant.inStock}
                type="button"
                data-selected={selectedVariantId === variant._id}
                onClick={() => setSelectedVariantId(variant._id)}
              >
                <span className={styles.greenDot}></span>
                {variant.size} / {variant.color}
              </button>
            ))}
          </div>

          <div className={styles.buttonContainer}>
            <ButtonStd variant="primary" fullWidth onClick={handleAddToCart}>
              Add to cart
            </ButtonStd>
            {cartMessage && (
              <div className={styles.cartMessage}>{cartMessage}</div>
            )}
            <ButtonStd variant="ghost-dark">
              <HeartIconStd className={styles.buttonIcon} />
            </ButtonStd>
          </div>
        </Card>
        <div className={styles.variantDiv}>
          <p>What's your size?</p>
          {variants.map((variant) => (
            <ButtonStd 
              variant='border' 
              className={selectedVariantId === variant._id ?  styles.borderSelected : ""} 
              key={variant._id} 
              disabled={!variant.inStock}
              onClick={() => setSelectedVariantId(variant._id)}> 
              {variant.size}

              {!variant.inStock && (
                <Line className={styles.disabledIcon} />
                )}
            </ButtonStd>
          ))}
        </div>
        
        <div className={styles.buttonContainer}>
            <ButtonStd variant='primary' fullWidth>Add to cart</ButtonStd>
            <ButtonStd variant='ghost-dark'><HeartIconStd className={styles.buttonIcon}/></ButtonStd>
        </div>
      </Card>

        {/* Seller info*/}
        <Card>
          <h2 className={styles.sellerInfo}>
            This product is sold by{" "}
            <span className={styles.seller}>{product.seller}</span>
          </h2>
        </Card>

        {/* Comments*/}
        <Card>
          <p className={styles.commentsText}>Comments:</p>
          <section className={styles.comment}>
            {comments.map((c, index) => (
              <div key={index} className={styles.commentItem}>
                {/* <CommentCard profilePicture={c.imageUrl} name={c.user} date={c.date} comment={c.comment} rating={c.rating}/> */}
                <div className={styles.commentContainer}>
                  <div className={styles.commentImg}>
                    <img src={c.imageUrl} alt="" />
                  </div>
                  <div className={styles.commentText}>
                    <h2 className={styles.commentName}>
                      {c.user}{" "}
                      <span className={styles.commentRating}>
                        Rating: {c.rating}/5
                      </span>
                    </h2>
                    <p className={styles.commentComment}>{c.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </Card>
      </div>
    </section>
  );
};

export default ProductView;
