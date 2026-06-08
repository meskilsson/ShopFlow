import { useEffect, useState } from "react";
import Card from "@/components/UI/Card";
import Container from "@/components/containers/Container";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./OrdersPage.module.css";
import { getOrderWithItemRequest } from "@/api/user";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  variants: number;
  ProductImage?: string;
};

type ProductVariant = {
  _id: string;
  product: Product;
  color: string;
  size: string;
  inStock?: boolean;
  sku?: string;
};

type OrderItem = {
  _id: string;
  order: string;
  productVariant: ProductVariant;
  quantity: number;
  priceAtPurchase: number;
  createdAt: string;
  updatedAt: string;
};

type Order = {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  sessionId?: string;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-EN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function OrdersPage() {
  const { user: authUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserOrders() {
      try {
        setIsLoading(true);
        setError("");

        if (!authUser?._id) {
          setOrders([]);
          setError("You need to be logged in to view your orders.");
          return;
        }


        const data = await getOrderWithItemRequest(authUser._id);

        setOrders(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    }

    getUserOrders();
  }, [authUser?._id]);

  return (
    <Container>
      <Card>
        <section className={styles.ordersPage}>
          <div className={styles.header}>
            <div>
              <h1>My Orders</h1>
              <p className={styles.subtitle}>
                View your recent purchases and order status.
              </p>
            </div>

            <span className={styles.orderCount}>
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {isLoading && (
            <div className={styles.stateBox}>
              <p>Loading orders...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className={styles.errorBox}>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <div className={styles.emptyBox}>
              <h2>No orders found</h2>
              <p>Your orders will appear here after you make a purchase.</p>
            </div>
          )}

          {!isLoading && !error && orders.length > 0 && (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <article key={order._id} className={styles.orderCard}>
                  <div className={styles.orderTop}>
                    <div>
                      <p className={styles.orderLabel}>Order</p>
                      <p className={styles.orderDate}>
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      <p className={styles.orderId}>{order._id}</p>
                    </div>
                  </div>

                  <div className={styles.summary}>
                    <div>
                      <span className={styles.summaryLabel}>Total</span>
                      <strong>{formatPrice(order.totalPrice)}</strong>
                    </div>

                    <div>
                      <span className={styles.summaryLabel}>Items</span>
                      <strong>{order.items.length}</strong>
                    </div>
                  </div>

                  <div className={styles.items}>
                    <h3>Items</h3>

                    {order.items.map((item) => {
                      const variant = item.productVariant;
                      const product = variant.product;

                      return (
                        <div key={item._id} className={styles.itemRow}>
                          {product.ProductImage && (
                            <img
                              src={product.ProductImage}
                              alt={product.name}
                              className={styles.productImage}
                            />
                          )}

                          <div>
                            <p className={styles.itemName}>{product.name}</p>

                            <p className={styles.itemMeta}>
                              Size: {variant.size}
                              {variant.color && ` · Color: ${variant.color}`}
                            </p>
                          </div>

                          <p className={styles.itemPrice}>
                            {formatPrice(item.priceAtPurchase)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </Card>
    </Container>
  );
}
