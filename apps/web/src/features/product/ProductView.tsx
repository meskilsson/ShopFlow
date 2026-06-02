import { useState, useEffect } from "react";
import styles from "./ProductView.module.css";
import FallbackProductImage from "@/assets/1.webp";
import HeartIconRegular from "@/assets/icons/heart-regular-full.svg?react";
import HeartIconSolid from "@/assets/icons/heart-solid-full.svg?react";
import Line from "@/assets/icons/line.svg?react";
import ButtonStd from "@/components/UI/ButtonStd";
import Card from "@/components/UI/Card";
import { addToCart } from "@/api/cart";
import ProductViewModal from "./ProductViewModal";
import { toggleWishlist } from "@/api/wishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getProductReviews, createProductReview } from "@/api/reviews";
import { getErrorMessage } from "@/utils/getErrorMessage";

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

type BackendReview = {
  _id: string;
  user?: string | {
    _id: string;
    name?: string;
    email?: string;
  };
  comment: string;
  rating: number;
  createdAt?: string;
};

function mapReviewToComment(review: BackendReview): Comment {
  const username =
    typeof review.user === "object" && review.user !== null
      ? review.user.name ?? "User"
      : "User";

  return {
    id: review._id,
    user: username,
    comment: review.comment,
    date: new Date(review.createdAt ?? Date.now()).toLocaleDateString("sv-SE", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }),
    rating: review.rating,
    imageUrl: "https://i.pravatar.cc/100?img=1",
  };
}

const ProductView = ({ product, variants }: ProductViewProps) => {
  const { isAuthenticated, refreshWishlist } = useAuth();
  const { setCartCount } = useCart();
  const [cartMessage, setCartMessage] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((variant) => variant.inStock !== false)?._id ?? null,
  );
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [reviewError, setReviewError] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);

  

  useEffect(() => {
    async function loadReviews() {
      try {
        const reviews = await getProductReviews(product._id, reviewPage, 3);
        setComments(reviews.data.map(mapReviewToComment));
        setReviewTotalPages(reviews.meta.totalPages);
        setReviewError("");
      } catch (error) {
        setReviewError(getErrorMessage(error));
      }
    }

    loadReviews();
  }, [product._id, reviewPage]);

    async function handleSaveComment(newComment: { comment: string; rating: number }) {
    try {
      const savedReview: BackendReview = await createProductReview(
        product._id,
        newComment,
      );

      setReviewPage(1);

      setComments([
        mapReviewToComment(savedReview),
        ...comments,
      ]);
      setReviewError("");
    } catch (error) {
      setReviewError(getErrorMessage(error));
    }
  }

  function handleOpenCommentModal() {
    if (!isAuthenticated) {
      alert("Login to comment");
      return;
    }

    setIsCommentModalOpen(true);
  }

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
      alert("Logga in for att spara i onskelistan");
      return;
    }

    try {
      const result = await toggleWishlist(product._id);
      setIsInWishlist(result.inWishlist);
      await refreshWishlist();
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
      setCartCount((prev) => prev + 1);
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
                Rating: {product.rating}/5 ★
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

          {reviewError ? (
            <p className={styles.reviewError}>{reviewError}</p>
          ) : null}

          <section className={styles.comment}>
            {comments.length === 0 ? (
              <p className={styles.noComment}>No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentContainer}>
                    <div className={styles.commentImg}>
                      <img src={comment.imageUrl} alt="" />
                    </div>
                    <div className={styles.commentText}>
                      <h2 className={styles.commentName}>
                        {comment.user}{" "}
                        <span className={styles.commentRating}>
                          {[1, 2, 3, 4, 5].map((star) => (
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

          {reviewTotalPages > 1 ? (
            <div className={styles.reviewPagination}>
              <ButtonStd
                variant="ghost-dark"
                disabled={reviewPage === 1}
                onClick={() => setReviewPage((page) => page - 1)}
              >
                Previous
              </ButtonStd>

              <span className={styles.reviewPageText}>
                {reviewPage}/{reviewTotalPages}
              </span>

              <ButtonStd
                variant="ghost-dark"
                disabled={reviewPage === reviewTotalPages}
                onClick={() => setReviewPage((page) => page + 1)}
              >
                Next
              </ButtonStd>
            </div>
          ) : null}

          <div className={styles.commentsBtn}>
            <ButtonStd
              variant="ghost-dark"
              onClick={handleOpenCommentModal}
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
