import CartItemCard from "./CartItemCard";
import styles from "./CartItems.module.css";
import type { CartItem } from "./types";

type CartItemsProps = {
  items: CartItem[];
  onDecreaseQuantity: (productId: string, quantity: number) => void;
  onIncreaseQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
};

const CartItems = ({
  items,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
}: CartItemsProps) => {
  return (
    <section className={styles.list}>
      {items.map((item) => (
        <CartItemCard
          key={item._id}
          productId={item.product._id}
          name={item.product.name}
          category={item.product.category}
          quantity={item.quantity}
          unitPrice={item.unitPrice}
          lineTotal={item.lineTotal}
          onDecreaseQuantity={onDecreaseQuantity}
          onIncreaseQuantity={onIncreaseQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </section>
  );
};

export default CartItems;
