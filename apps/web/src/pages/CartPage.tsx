import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/api/cart";
import Container from "@/components/containers/Container";
import ButtonStd from "@/components/UI/ButtonStd";
import CartItems from "@/features/cart/CartItems";
import CartSummary from "@/features/cart/CartSummary";
import type { CartItem, CartResponse } from "@/features/cart/types";
import styles from "./CartPage.module.css";
import type { Dispatch, SetStateAction } from "react";

type ApiError = Error & {
  status?: number;
};

function applyCartResponse(
  data: CartResponse,
  setCartItems: Dispatch<SetStateAction<CartItem[]>>,
  setCartTotal: Dispatch<SetStateAction<number>>,
) {
  setCartItems(data.items);
  setCartTotal(data.total);
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart()
      .then((data: CartResponse) => {
        applyCartResponse(data, setCartItems, setCartTotal);
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

  async function handleDecreaseQuantity(productId: string, quantity: number) {
    try {
      const updatedCart = await updateCartItemQuantity(productId, quantity - 1);
      applyCartResponse(updatedCart, setCartItems, setCartTotal);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  }

  async function handleIncreaseQuantity(productId: string, quantity: number) {
    try {
      const updatedCart = await updateCartItemQuantity(productId, quantity + 1);
      applyCartResponse(updatedCart, setCartItems, setCartTotal);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  }

  async function handleRemoveItem(productId: string) {
    try {
      const updatedCart = await removeCartItem(productId);
      applyCartResponse(updatedCart, setCartItems, setCartTotal);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 49 : 0;
  const total = subtotal + shipping;
  const hasItems = cartItems.length > 0;

  if (loading) {
    return (
      <Container>
        <div className={styles.page}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Cart</p>
            <h1>Your cart</h1>
            <p className={styles.subtitle}>
              Review your items before checkout.
            </p>
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
          <p className={styles.subtitle}>Review your items before checkout.</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            {!hasItems ? (
              <div className={styles.empty}>
                <h2>Your cart is empty</h2>
                <p className={styles.emptyText}>
                  Add a product to your cart and it will show up here.
                </p>
                <ButtonStd variant="primary" onClick={() => navigate("/")}>
                  Continue shopping
                </ButtonStd>
              </div>
            ) : (
              <section className={styles.surface}>
                <h2 className={styles.sectionTitle}>Items in your cart</h2>
                <CartItems
                  items={cartItems}
                  onDecreaseQuantity={handleDecreaseQuantity}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              </section>
            )}
          </div>

          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            itemCount={itemCount}
            onContinueShopping={() => navigate("/")}
            onCheckout={() => navigate("/checkout")}
          />
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
