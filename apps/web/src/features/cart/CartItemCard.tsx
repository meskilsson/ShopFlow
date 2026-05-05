import { Trash2 } from "lucide-react";
import styles from "./CartItemCard.module.css";
import FallbackProductImage from "@/assets/1.webp";

type CartItemCardProps = {
  productVariantId: string;
  name: string;
  category: string;
  image?: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  onDecreaseQuantity: (productVariantId: string, quantity: number) => void;
  onIncreaseQuantity: (productVariantId: string, quantity: number) => void;
  onRemoveItem: (productVariantId: string) => void;
  /** New: readonly mode used on OrderPage */
  readonly?: boolean;
};

const CartItemCard = ({
  productVariantId,
  name,
  category,
  image,
  color,
  size,
  quantity,
  unitPrice,
  lineTotal,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
  readonly = false,
}: CartItemCardProps) => {
  return (
    <article className={styles.card}>
      <img
        src={image || FallbackProductImage}
        alt={name}
        className={`${styles.image} ${readonly ? styles.imageReadonly : ""}`}
      />

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <p className={styles.category}>{category}</p>
            <h2 className={styles.title}>{name}</h2>
            <p className={styles.variant}>
              {size} / {color}
            </p>
          </div>
          <p className={styles.total}>{lineTotal} kr</p>
        </div>

        <div className={styles.meta}>
          {!readonly && (
            <div className={styles.quantityControls}>
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() => onDecreaseQuantity(productVariantId, quantity)}
                aria-label={`Decrease quantity of ${name}`}
              >
                -
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button
                type="button"
                className={styles.quantityButton}
                onClick={() => onIncreaseQuantity(productVariantId, quantity)}
                aria-label={`Increase quantity of ${name}`}
              >
                +
              </button>
            </div>
          )}

          <p>Price per item: {unitPrice} kr</p>

          {!readonly && (
            <button
              type="button"
              className={styles.removeButton}
              aria-label={`Remove ${name} from cart`}
              onClick={() => onRemoveItem(productVariantId)}
            >
              <Trash2 className={styles.removeIcon} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CartItemCard;
