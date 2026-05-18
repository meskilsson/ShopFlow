import { useParams, useNavigate } from "react-router-dom";
import ButtonStd from "@/components/UI/ButtonStd";
import styles from "./OrderConfirmationPage.module.css";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>

        <h1>Thank you for your order!</h1>
        <p className={styles.orderNumber}>
          Order number: <strong>#{orderId}</strong>
        </p>

        <p className={styles.message}>
          Your order has been registered and is now being processed.
          <br />
          You will receive a confirmation email shortly.
        </p>

        <div className={styles.actions}>
          <ButtonStd
            variant="primary"
            fullWidth
            onClick={() => navigate("/products")}
          >
            Continue shopping
          </ButtonStd>

          <ButtonStd
            variant="secondary"
            fullWidth
            onClick={() => navigate("/profile/orders")}
          >
            View my orders
          </ButtonStd>
        </div>

        <p className={styles.note}>
          Any questions? Contact us at support@shopflow.se
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
