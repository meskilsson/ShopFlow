import { useState } from "react";
import styles from "./ProductView.module.css";
import FallbackProductImage from "@/assets/1.webp";
import HeartIconStd from "@/assets/icons/heart-regular-full.svg?react";
import Line from "@/assets/icons/line.svg?react";
import ButtonStd from "@/components/UI/ButtonStd";
import Card from "@/components/UI/Card";
import { addToCart } from "@/api/cart";
import ProductViewModal from "./ProductViewModal";

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

type Comment = {
  id: string;
  user: string;
  comment: string;
  date: string;
  rating: number;
  imageUrl: string;
};

const ProductView = ({ product, variants }: ProductViewProps) => {
  const [cartMessage, setCartMessage] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((variant) => variant.inStock !== false)?._id ?? null,
  );
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      user: "Chas-Robin",
      comment: "Love these boots!",
      date: "14 April 2026",
      rating: 4,
      imageUrl: "https://i.pravatar.cc/100?img=22",
    },
    {
      id: "comment-2",
      user: "Marcus",
      comment: "Livets dojjor",
      date: "14 April 2026",
      rating: 5,
      imageUrl: "https://i.pravatar.cc/100?img=2",
    },
    {
      id: "comment-3",
      user: "Pontus",
      comment: "Jag fick bara en 😟",
      date: "14 April 2026",
      rating: 1,
      imageUrl: "https://i.pravatar.cc/100?img=1",
    },
  ]);

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

  function handleSaveComment(newComment: { comment: string; rating: number }) {
    setComments([
      {
        id: crypto.randomUUID(),
        user: "You",
        comment: newComment.comment,
        date: new Date().toLocaleDateString("sv-SE", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
        }),
        rating: newComment.rating,
        imageUrl: "https://i.pravatar.cc/100?img=1",
      },
      ...comments,
    ]);
  }

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
            <ButtonStd variant="ghost-dark">
              <HeartIconStd className={styles.buttonIcon} />
            </ButtonStd>
          </div>

          {cartMessage ? (
            <div className={styles.cartMessage}>{cartMessage}</div>
          ) : null}
        </Card>

        <Card>
          <h2 className={styles.sellerInfo}>
            This product is sold by{" "}
            <span className={styles.seller}>{product.seller || "ShopFlow"}</span>
          </h2>
        </Card>

        <Card>
          <p className={styles.commentsText}>Comments:</p>

          <section className={styles.comment}>
                {comments.length === 0 ? (
      <p className={styles.noComment}> No comment yet</p>
          ) : (
            comments.map((comment, index) => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentContainer}>
                  <div className={styles.commentImg}>
                    <img src={comment.imageUrl} alt="" />
                  </div>
                  <div className={styles.commentText}>
                    <h2 className={styles.commentName}>
                      {comment.user}{" "}
                      <span className={styles.commentRating}>
                        {[1, 2, 3, 4, 5].map ((star) =>(
                          <span key={star}>
                            {star <= comment.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </span>
                    </h2>
                    <p className={styles.commentDate}>{comment.date}</p>
                    <p className={styles.commentComment}>{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))
          )}
            
          </section>

          <div className={styles.commentsBtn}>
            <ButtonStd
              variant="ghost-dark"
              onClick={() => setIsCommentModalOpen(true)}
            >
              Add a comment
            </ButtonStd>
          </div>
        </Card>
      </div>

      <ProductViewModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSave={handleSaveComment}
      />
    </section>
  );
};

export default ProductView;
