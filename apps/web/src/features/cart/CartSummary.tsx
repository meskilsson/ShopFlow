import ButtonStd from "@/components/UI/ButtonStd";
import styles from "./CartSummary.module.css";

type CartSummaryProps = {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  onContinueShopping?: () => void;
};

const CartSummary = ({
  subtotal,
  shipping,
  total,
  itemCount,
  onContinueShopping,
}: CartSummaryProps) => {
  return (
    <aside className={styles.summary}>
      <div className={styles.block}>
        <h2 className={styles.title}>Summary</h2>

        <div className={styles.row}>
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>{subtotal} kr</span>
        </div>
        <div className={styles.row}>
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `${shipping} kr`}</span>
        </div>
        <div className={`${styles.row} ${styles.totalRow}`}>
          <span>Total</span>
          <span>{total} kr</span>
        </div>

        <div className={styles.actions}>
          <ButtonStd variant="primary" fullWidth>
            Checkout
          </ButtonStd>
          <ButtonStd
            variant="ghost-dark"
            fullWidth
            onClick={onContinueShopping}
          >
            Continue shopping
          </ButtonStd>
        </div>
      </div>
    </aside>
  );
};

export default CartSummary;
