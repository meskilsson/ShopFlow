import { useState } from "react";
import ButtonStd from "@/components/UI/ButtonStd";
import Modal from "@/components/UI/Modal/Modal";
import styles from "./ProductViewModal.module.css";

type ProductViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (comment: { comment: string; rating: number }) => void;
};

const ProductViewModal = ({ isOpen, onClose, onSave }: ProductViewModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const isCommentValid = commentText.trim().length > 0 && commentRating > 0;

  function handleClose() {
    setCommentText("");
    setCommentRating(0);
    setHoverRating(0);
    onClose();
  }

  function handleSave() {
    if (!isCommentValid) return;

    onSave({
      comment: commentText.trim(),
      rating: commentRating,
    });

    handleClose();
  }

  return (
    <Modal
      title="Add a comment"
      isOpen={isOpen}
      onClose={handleClose}
      actions={
        <>
          <ButtonStd variant="ghost-dark" onClick={handleClose}>
            Cancel
          </ButtonStd>

          <ButtonStd variant="primary" onClick={handleSave} disabled={!isCommentValid}>
            Save
          </ButtonStd>
        </>
      }
    >
      <div className={styles.ratingSelect}>
        {[1, 2, 3, 4, 5].map((rating) => {
          const activeRating = hoverRating || commentRating;

          return (
            <button
              key={rating}
              type="button"
              className={styles.starButton}
              onClick={() => setCommentRating(rating)}
              onMouseEnter={() => setHoverRating(rating)}
              onMouseLeave={() => setHoverRating(0)}
            >
              {rating <= activeRating ? "★" : "☆"}
            </button>
          );
        })}
      </div>

      <textarea
        className={styles.commentInput}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment ..."
        maxLength={100}
      />
      <p className={styles.commentCounter}>
        {commentText.length}/100
      </p>
    </Modal>
  );
};

export default ProductViewModal;
