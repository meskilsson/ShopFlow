import styles from "./CartItemCard.module.css";

import ProductImage from "@/assets/1.webp";

type CartItemCardProps = {
  productVariantId: string;
  name: string;
  category: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  onDecreaseQuantity: (productVariantId: string, quantity: number) => void;
  onIncreaseQuantity: (productVariantId: string, quantity: number) => void;
  onRemoveItem: (productVariantId: string) => void;
};

const CartItemCard = ({
  productVariantId,
  name,
  category,
  color,
  size,
  quantity,
  unitPrice,
  lineTotal,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
}: CartItemCardProps) => {
  return (
    <article className={styles.card}>
      <img src={ProductImage} alt={name} className={styles.image} />

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
          <p>Price per item: {unitPrice} kr</p>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemoveItem(productVariantId)}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItemCard;
