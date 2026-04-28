import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItems from "../features/cart/CartItems";
import CartSummary from "../features/cart/CartSummary";
import styles from "./OrderPage.module.css";

const OrderPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/orders/from-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // to send cookies/session
        },
      );

      if (!response.ok) {
        throw new Error("Could not create order");
      }

      const order = await response.json();
      navigate(`/order-confirmation/${order._id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong with the order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left column */}
        <div className={styles.leftColumn}>
          <h1>Confirm your order</h1>

          <div className={styles.section}>
            <h2>Delivery address</h2>
            <p>Tomac Jansson</p>
            <p>Example Street 12</p>
            <p>123 45 Stockholm</p>
          </div>

          <div className={styles.section}>
            <h2>Payment method</h2>
            <div className={styles.paymentOptions}>
              <label>
                <input type="radio" name="payment" defaultChecked /> Card
              </label>
              <label>
                <input type="radio" name="payment" /> Swish
              </label>
              <label>
                <input type="radio" name="payment" /> Invoice
              </label>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* Right column */}
        <div className={styles.rightColumn}>
          <h2>Your order</h2>
          <CartItems />
          <CartSummary />

          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className={styles.confirmButton}
          >
            {loading ? "Creating order..." : "Complete purchase"}
          </button>

          <p className={styles.terms}>
            By completing the purchase you accept our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
