import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./ProductCard.module.css";
import TrashIcon from "@/assets/icons/trash-can-solid-full.svg?react";
import NoImagePlaceholder from "@/components/UI/NoImagePlaceholder";

interface ProductCardProps {
  id: string;
  title: string;
  brand: string;
  variants: number;
  price: number;
  link: string;
  image?: string;
  isWishlist?: boolean;
  onRemove?: (id: string) => void;
}

const ProductCard = ({
  title,
  brand,
  variants,
  price,
  link,
  image,
  isWishlist = false,
  onRemove,
  id,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(id);
  };

  return (
    <Link
      to={link}
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageWrapper}>
        {image
          ? <img src={image} alt={title} className={styles.productImage} />
          : <NoImagePlaceholder />
        }

        {isWishlist && onRemove && isHovered && (
          <button
            onClick={handleRemove}
            className={styles.removeButton}
            title="Ta bort från önskelista"
          >
            <TrashIcon className={styles.trashIcon} />
          </button>
        )}
      </div>

      <div className={styles.productInfo}>
        <p className={styles.productTitle}>{title}</p>
        <p className={styles.productBrand}>{brand}</p>

        <div className={styles.metaRow}>
          <span className={styles.productVariants}>{variants} size(s)</span>
          <span className={styles.productPrice}>{price} kr</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
