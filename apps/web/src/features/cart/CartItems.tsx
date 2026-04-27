import CartItemCard from "./CartItemCard";
import styles from "./CartItems.module.css";
import type { CartItem } from "./types";

type CartItemsProps = {
  items: CartItem[];
};

const CartItems = ({ items }: CartItemsProps) => {
  return (
    <section className={styles.list}>
      {items.map((item) => (
        <CartItemCard
          key={item._id}
          name={item.product.name}
          category={item.product.category}
          quantity={item.quantity}
          unitPrice={item.unitPrice}
          lineTotal={item.lineTotal}
        />
      ))}
    </section>
  );
};

export default CartItems;
