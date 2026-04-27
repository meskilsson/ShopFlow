import styles from "./CartItemCard.module.css";

import ProductImage from "@/assets/1.webp";

type CartItemCardProps = {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  onDecreaseQuantity: (productId: string, quantity: number) => void;
  onIncreaseQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
};

const CartItemCard = ({
  productId,
  name,
  category,
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
          </div>
          <p className={styles.total}>{lineTotal} kr</p>
        </div>

        <div className={styles.meta}>
          <div className={styles.quantityControls}>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => onDecreaseQuantity(productId, quantity)}
              aria-label={`Decrease quantity of ${name}`}
            >
              -
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button
              type="button"
              className={styles.quantityButton}
              onClick={() => onIncreaseQuantity(productId, quantity)}
              aria-label={`Increase quantity of ${name}`}
            >
              +
            </button>
          </div>
          <p>Price per item: {unitPrice} kr</p>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemoveItem(productId)}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItemCard;
