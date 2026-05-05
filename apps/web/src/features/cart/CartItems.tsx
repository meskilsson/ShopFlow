import CartItemCard from "./CartItemCard";
import styles from "./CartItems.module.css";
import type { CartItem } from "./types";

type CartItemsProps = {
  items: CartItem[];
  onDecreaseQuantity: (productVariantId: string, quantity: number) => void;
  onIncreaseQuantity: (productVariantId: string, quantity: number) => void;
  onRemoveItem: (productVariantId: string) => void;
  readonly?: boolean;
};

const CartItems = ({
  items,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
  readonly = false,
}: CartItemsProps) => {
  return (
    <section className={styles.list}>
      {items.map((item) => (
        <CartItemCard
          key={item._id}
          productVariantId={item.productVariant._id}
          name={item.product.name}
          category={item.product.category}
          image={item.product.ProductImage}
          color={item.productVariant.color}
          size={item.productVariant.size}
          quantity={item.quantity}
          unitPrice={item.unitPrice}
          lineTotal={item.lineTotal}
          onDecreaseQuantity={onDecreaseQuantity}
          onIncreaseQuantity={onIncreaseQuantity}
          onRemoveItem={onRemoveItem}
          readonly={readonly} // <-- NYTT
        />
      ))}
    </section>
  );
};

export default CartItems;
