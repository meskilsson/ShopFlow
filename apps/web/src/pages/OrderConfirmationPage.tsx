import { useParams, useNavigate } from "react-router-dom";
import ButtonStd from "@/components/UI/ButtonStd";
import styles from "./OrderConfirmationPage.module.css";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>🎉</div>

        <h1>Thank you for your order!</h1>

        <p className={styles.orderNumber}>
          Order <strong>#{orderId}</strong>
        </p>

        <p className={styles.message}>
          Your order has been received and is now being prepared.
          <br />
          You will receive a confirmation email shortly.
        </p>

        <p className={styles.shippingInfo}>
          Your order will be shipped within <strong>two working days</strong>.
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
            variant="ghost-dark"
            fullWidth
            onClick={() => navigate("/profile/orders")}
          >
            View my orders
          </ButtonStd>
        </div>

        <p className={styles.note}>
          Questions? Contact us at{" "}
          <a href="mailto:support@shopflow.se">support@shopflow.se</a>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
