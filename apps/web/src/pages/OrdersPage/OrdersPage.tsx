import { useState, useEffect } from "react";
import Card from "@/components/UI/Card";
import Container from "@/components/containers/Container";
import { useAuth } from "@/contexts/AuthContext";

type OrderItem = {
    _id: string;
    order: string;
    productVariant: unknown;
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

export default function OrdersPage() {
    const { user: authUser } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUserOrders() {
            try {
                if (!authUser?._id) {
                    setError("No user found");
                    return;
                }

                const response = await fetch(
                    `http://localhost:5000/api/v1/orders/user/${authUser._id}/with-items`
                );

                const data: Order[] = await response.json();

                if (!response.ok) {
                    throw new Error("Could not fetch orders");
                }

                setOrders(data);
                console.log(data);
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

    if (isLoading) return <p>Loading orders...</p>;

    if (error) return <p>{error}</p>;

    return (
        <Container>
            <Card>
                <h1>My Orders</h1>

                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id}>
                            <h2>Order ID: {order._id}</h2>
                            <p>Total: {order.totalPrice} kr</p>
                            <p>Status: {order.status}</p>
                            <p>Payment: {order.paymentStatus}</p>

                            <h3>Items</h3>

                            {order.items.map((item) => (
                                <div key={item._id}>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: {item.priceAtPurchase} kr</p>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </Card>
        </Container>
    );
}