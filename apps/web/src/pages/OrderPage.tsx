import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItems from "../features/cart/CartItems";
import CartSummary from "../features/cart/CartSummary";
import styles from "./OrderPage.module.css";

const OrderPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/cart", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setCart(data);
        } else if (res.status === 404) {
          setError(
            "Din kundvagn är tom. Lägg till produkter innan du går vidare.",
          );
        }
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta kundvagnen");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleConfirmOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Din kundvagn är tom!");
      return;
    }

    setOrderLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/v1/orders/from-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Kunde inte skapa order");

      const order = await res.json();
      navigate(`/order-confirmation/${order._id}`);
    } catch (err: any) {
      setError(err.message || "Något gick fel");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <p>Laddar kundvagn...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Vänster kolumn */}
        <div className={styles.leftColumn}>
          <h1>Bekräfta din beställning</h1>

          <div className={styles.section}>
            <h2>Leveransadress</h2>
            <p>Tomac Jansson</p>
            <p>Exempelgatan 12</p>
            <p>123 45 Stockholm</p>
          </div>

          <div className={styles.section}>
            <h2>Betalningssätt</h2>
            <div className={styles.paymentOptions}>
              <label>
                <input type="radio" name="payment" defaultChecked /> Kort
              </label>
              <label>
                <input type="radio" name="payment" /> Swish
              </label>
              <label>
                <input type="radio" name="payment" /> Faktura
              </label>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {/* Höger kolumn */}
        <div className={styles.rightColumn}>
          <h2>Din order</h2>

          {cart && cart.items && cart.items.length > 0 ? (
            <>
              <CartItems items={cart.items} />
              <CartSummary
                subtotal={cart.total || 0}
                shipping={49}
                total={(cart.total || 0) + 49}
                itemCount={cart.items.length}
              />
            </>
          ) : (
            <p>Din kundvagn är tom. Lägg till produkter innan du fortsätter.</p>
          )}

          <button
            onClick={handleConfirmOrder}
            disabled={
              orderLoading || !cart || !cart.items || cart.items.length === 0
            }
            className={styles.confirmButton}
          >
            {orderLoading ? "Skapar order..." : "Slutför köp"}
          </button>

          <p className={styles.terms}>
            Genom att slutföra köpet godkänner du våra villkor och
            integritetspolicy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
