import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "@/api/cart";
import Container from "@/components/containers/Container";
import ButtonStd from "@/components/UI/ButtonStd";
import CartItems from "@/features/cart/CartItems";
import CartSummary from "@/features/cart/CartSummary";
import type { CartItem, CartResponse } from "@/features/cart/types";
import styles from "./CartPage.module.css";

const mockCartItems: CartItem[] = [
  {
    _id: "mock-cart-item-1",
    product: {
      _id: "mock-product-1",
      name: "DUNK LOW RETRO",
      price: 1200,
      category: "Shoes",
    },
    quantity: 1,
    unitPrice: 1200,
    lineTotal: 1200,
  },
];

type ApiError = Error & {
  status?: number;
};

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart()
      .then((data: CartResponse) => {
        setCartItems(data.items);
        setCartTotal(data.total);
      })
      .catch((error: ApiError) => {
        if (error.status === 404) {
          setCartItems([]);
          setCartTotal(0);
          return;
        }

        console.error("Failed to fetch cart:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 49 : 0;
  const total = subtotal + shipping;
  const hasRealItems = cartItems.length > 0;
  const previewItems = hasRealItems ? cartItems : mockCartItems;
  const previewSubtotal = hasRealItems ? subtotal : mockCartItems[0].lineTotal;
  const previewShipping = 49;
  const previewTotal = previewSubtotal + previewShipping;
  const previewItemCount = hasRealItems
    ? itemCount
    : mockCartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <Container>
        <div className={styles.page}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Cart</p>
            <h1>Your cart</h1>
            <p className={styles.subtitle}>Review your items before checkout.</p>
          </div>

          <div className={styles.loading}>Loading cart...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Cart</p>
          <h1>Your cart</h1>
          <p className={styles.subtitle}>
            {hasRealItems
              ? "Review your items before checkout."
              : "Previewing the cart layout with a mock product until real items are added."}
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            {!hasRealItems ? (
              <div className={styles.empty}>
                <h2>No real cart items yet</h2>
                <p className={styles.emptyText}>
                  This preview uses one mock product so you can style the cart
                  page before the products flow is connected.
                </p>
                <ButtonStd variant="primary" onClick={() => navigate("/")}>
                  Continue shopping
                </ButtonStd>
              </div>
            ) : null}

            <section className={styles.surface}>
              <h2 className={styles.sectionTitle}>Items in your cart</h2>
              <CartItems items={previewItems} />
            </section>
          </div>

          <CartSummary
            subtotal={previewSubtotal}
            shipping={previewShipping}
            total={previewTotal}
            itemCount={previewItemCount}
            onContinueShopping={() => navigate("/")}
          />
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
