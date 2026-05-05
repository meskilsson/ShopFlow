import { useParams, Link } from "react-router-dom";
import styles from "./OrderConfirmationPage.module.css";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>

        <h1>Thank you for your order!</h1>
        <p className={styles.orderNumber}>
          Order number: <strong>#{orderId}</strong>
        </p>

        <p className={styles.message}>
          Your order will be shipped within two working days.
        </p>

        <div className={styles.actions}>
          <Link to="/products" className={styles.buttonPrimary}>
            Continue shopping
          </Link>
          <Link to="/profile/orders" className={styles.buttonSecondary}>
            View my orders
          </Link>
        </div>

        <p className={styles.note}>
          Any questions? Contact us at support@shopflow.se
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
