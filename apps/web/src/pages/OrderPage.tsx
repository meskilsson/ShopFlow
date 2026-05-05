import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "@/api/client";
import { getCart } from "@/api/cart";
import CheckoutStepper from "@/features/checkout/CheckoutStepper";
import CartItems from "../features/cart/CartItems";
import CartSummary from "../features/cart/CartSummary";
import styles from "./OrderPage.module.css";
import type { CartResponse } from "../features/cart/types";
import type { Address } from "@/features/address/address.types";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress as
    | Address
    | undefined;

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        if (err.status === 404) {
          setCart(null);
        } else {
          setError("Could not fetch your cart");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleConfirmOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    setOrderLoading(true);
    setError(null);

    try {
      const order = await apiFetch("/orders/from-cart", { method: "POST" });
      navigate(`/order-confirmation/${order._id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setOrderLoading(false);
    }
  };

  const hasItems = cart && cart.items && cart.items.length > 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.page}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Checkout</p>
            <h1>Complete your order</h1>
          </div>
          <div className={styles.loading}>Loading order...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <CheckoutStepper
          steps={[
            { label: "Address", status: "complete" },
            { label: "Payment", status: "current" },
            { label: "Review", status: "locked" },
          ]}
        />

        <div className={styles.header}>
          <p className={styles.eyebrow}>Checkout</p>
          <h1>Complete your order</h1>
          <p className={styles.subtitle}>
            {hasItems
              ? "Review your items and complete your purchase."
              : "Your cart is empty. Add some products before continuing."}
          </p>
        </div>

        <div className={styles.content}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            <div className={styles.section}>
              <h2>Delivery Address</h2>
              {selectedAddress ? (
                <>
                  <p>{selectedAddress.full_name}</p>
                  <p>{selectedAddress.street}</p>
                  <p>
                    {selectedAddress.postal_code} {selectedAddress.city}
                  </p>
                  {selectedAddress.country && <p>{selectedAddress.country}</p>}
                </>
              ) : (
                <p className={styles.error}>
                  No address selected. Please go back to checkout.
                </p>
              )}
            </div>

            <div className={styles.section}>
              <h2>Payment Method</h2>
              <div className={styles.paymentOptions}>
                <label className={styles.disabledOption}>
                  <input type="radio" name="payment" disabled /> Credit Card
                </label>
                <label className={styles.disabledOption}>
                  <input type="radio" name="payment" disabled /> Swish
                </label>
                <label>
                  <input type="radio" name="payment" defaultChecked /> Invoice
                </label>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {/* Complete your order button – moved to left column */}
            <button
              onClick={handleConfirmOrder}
              disabled={orderLoading || !hasItems}
              className={styles.confirmButton}
            >
              {orderLoading ? "Creating order..." : "Complete your order"}
            </button>

            <p className={styles.terms}>
              By completing your purchase you agree to our terms and privacy
              policy.
            </p>
          </div>

          {/* RIGHT COLUMN – Read-only order summary */}
          <div className={styles.rightColumn}>
            <h2>Your order</h2>

            {hasItems ? (
              <>
                <CartItems
                  items={cart.items}
                  onDecreaseQuantity={() => {}}
                  onIncreaseQuantity={() => {}}
                  onRemoveItem={() => {}}
                  readonly={true}
                />
                <CartSummary
                  subtotal={cart.total || 0}
                  shipping={49}
                  total={(cart.total || 0) + 49}
                  itemCount={cart.items.length}
                  onContinueShopping={undefined}
                  onCheckout={undefined}
                />
              </>
            ) : (
              <p>Your cart is empty. Please add products before continuing.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
