import styles from "./CartItemCard.module.css";

import ProductImage from "@/assets/1.webp";

type CartItemCardProps = {
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const CartItemCard = ({
  name,
  category,
  quantity,
  unitPrice,
  lineTotal,
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
          <p>Quantity: {quantity}</p>
          <p>Price per item: {unitPrice} kr</p>
        </div>
      </div>
    </article>
  );
};

export default CartItemCard;
