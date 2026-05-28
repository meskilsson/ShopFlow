import { use, useState } from "react";
import styles from "./ProductView.module.css";
import FallbackProductImage from "@/assets/1.webp";
import HeartIconStd from "@/assets/icons/heart-regular-full.svg?react";
import Line from "@/assets/icons/line.svg?react";
import ButtonStd from "@/components/UI/ButtonStd";
import Card from "@/components/UI/Card";
import { addToCart } from "@/api/cart";
import Modal from "@/components/UI/Modal/Modal";

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
  const [cartMessage, setCartMessage] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((variant) => variant.inStock !== false)?._id ?? null,
  );

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const isCommentValid = commentText.trim().length > 0 && commentRating > 0;


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

  const [comments, setComments] = useState([
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
  ]);

  function handleSaveComment() {
    if (!commentText.trim() || commentRating === 0) return;
    
    setComments([
      ...comments,
      {
        user: "You",
        comment: commentText,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month:"long",
          year:"numeric"
        }),
        rating: commentRating,
        imageUrl: "https://i.pravatar.cc/100?img=1",
      },
    ]);

    setCommentText("");
    setCommentRating(0)
    setIsCommentModalOpen(false);
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
            {comments.map((c, index) => (
              <div key={index} className={styles.commentItem}>
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

            {/* ===== MODAL ===== */}
      <Modal
        title="Add a comment"
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        actions={
          <>
            <ButtonStd
              variant="ghost-dark"
              onClick={() => {
                setIsCommentModalOpen(false)
              }} >
              Cancel
            </ButtonStd>

            <ButtonStd
              variant="primary"
              onClick={handleSaveComment} 
              disabled={!isCommentValid}>
                Save
              </ButtonStd>
          </>
        }
      >
        <div className="{styles.ratingSelect">
          {[1, 2, 3, 4, 5].map((rating) => {
            const activeRating = hoverRating || commentRating;

            return (
              <button
              key={rating}
              type="button"
              className={styles.starButton}
              onClick={()=> setCommentRating(rating)}
              onMouseEnter={() => setHoverRating(rating)}
              onMouseLeave={() => setHoverRating(0)}
              >
                {rating <= activeRating ? "★" : "☆"} 
              </button>
            )
          })}
        </div>

        <textarea
          className={styles.commentInput}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment ..." 
        />
      </Modal>

    </section>
  );
};

export default ProductView;
