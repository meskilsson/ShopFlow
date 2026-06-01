import { useState, useEffect } from "react";
import {
    getAdminOrderRequest,
    deleteAdminOrderRequest,
    restoreAdminOrderRequest,
} from "@/api/admin.order";

import ButtonStd from "@/components/UI/ButtonStd";
import Card from "@/components/UI/Card";
import Modal from "@/components/UI/Modal/Modal";
import styles from "./AdminOrderPage.module.css";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { formatDateEnglish } from "@/utils/formatDateEnglish";
import { formatPrice } from "@/utils/formatPrice";

type OrderUser =
    | {
        _id: string;
        name: string;
        email: string;
        username: string;
        role: "buyer" | "seller" | "admin";
    }
    | string
    | null;

export interface OrderInput {
    _id: string;
    user?: OrderUser;
    sessionId?: string;
    totalPrice: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    deletedAt?: string | null;
    deletedBy?: string | null;
    deleteReason?: string | null;
    createdAt?: string;
    updatedAt?: string;
}


function getCustomerLabel(user?: OrderUser, sessionId?: string) {
    if (!user && sessionId) return `Guest session: ${sessionId}`;
    if (!user) return "N/A";

    if (typeof user === "string") {
        return user;
    }

    return `${user.name} (${user.email})`;
}

export default function AdminOrderPage() {
    const [orders, setOrders] = useState<OrderInput[]>([]);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState("");
    const [isRestoring, setIsRestoring] = useState("");

    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [restoreError, setRestoreError] = useState("");

    const [deleteReason, setDeleteReason] = useState("");

    const [orderToDelete, setOrderToDelete] = useState<OrderInput | null>(null);
    const [orderToRestore, setOrderToRestore] = useState<OrderInput | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

    const activeOrders = orders.filter((order) => !order.deletedAt).length;
    const deletedOrders = orders.filter((order) => order.deletedAt).length;

    useEffect(() => {
        async function getAdminOrders() {
            setError("");
            setIsLoading(true);

            try {
                const data = await getAdminOrderRequest({
                    includeDeleted: true,
                    page,
                    limit,
                });

                setOrders(data.orders);
                setTotalPages(data.totalPages);
                setTotalOrders(data.totalOrders);
            } catch (error) {
                if (error instanceof Error) {
                    setError(getErrorMessage(error.message) || "Failed to fetch orders");
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

        getAdminOrders();
    }, [page, limit]);

    async function handleDelete(orderId: string) {
        setDeleteError("");
        setIsDeleting(orderId);

        try {
            const data = await deleteAdminOrderRequest(orderId, deleteReason);
            const updatedOrder = data.order ?? data;

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId ? updatedOrder : order,
                ),
            );

            setDeleteReason("");
            setOrderToDelete(null);
            setIsDeleteModalOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                setDeleteError(getErrorMessage(error.message) || "Failed to delete order");
            } else {
                setDeleteError("Something went wrong");
            }
        } finally {
            setIsDeleting("");
        }
    }

    async function handleRestore(orderId: string) {
        setRestoreError("");
        setIsRestoring(orderId);

        try {
            const data = await restoreAdminOrderRequest(orderId);
            const updatedOrder = data.order ?? data;

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId ? updatedOrder : order,
                ),
            );

            setOrderToRestore(null);
            setIsRestoreModalOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                setRestoreError(getErrorMessage(error.message) || "Failed to restore order");
            } else {
                setRestoreError("Something went wrong");
            }
        } finally {
            setIsRestoring("");
        }
    }

    function openDeleteModal(order: OrderInput) {
        setDeleteError("");
        setDeleteReason("");
        setOrderToDelete(order);
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        if (isDeleting) return;

        setDeleteError("");
        setDeleteReason("");
        setOrderToDelete(null);
        setIsDeleteModalOpen(false);
    }

    function openRestoreModal(order: OrderInput) {
        setRestoreError("");
        setOrderToRestore(order);
        setIsRestoreModalOpen(true);
    }

    function closeRestoreModal() {
        if (isRestoring) return;

        setRestoreError("");
        setOrderToRestore(null);
        setIsRestoreModalOpen(false);
    }

    if (isLoading) return <p className={styles.stateText}>Loading orders...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>Order management</p>
                    <h1>Admin orders</h1>
                    <p>
                        Manage orders, inspect soft-deleted orders, and restore
                        orders when needed.
                    </p>
                </div>
            </header>

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <span>Total orders</span>
                    <strong>{totalOrders}</strong>
                </div>

                <div className={styles.summaryCard}>
                    <span>Active orders</span>
                    <strong>{activeOrders}</strong>
                </div>

                <div className={styles.summaryCard}>
                    <span>Deleted orders</span>
                    <strong>{deletedOrders}</strong>
                </div>
            </div>

            {restoreError && <p className={styles.error}>{restoreError}</p>}

            <div className={styles.ordersGrid}>
                {orders.map((order) => {
                    const isDeleted = Boolean(order.deletedAt);

                    return (
                        <Card
                            key={order._id}
                            variant="default"
                            className={`${styles.orderCard} ${isDeleted ? styles.deleted : ""
                                }`}
                        >
                            <div className={styles.orderHeader}>
                                <div>
                                    <p className={styles.orderId}>{order._id}</p>
                                    <h2>{formatPrice(order.totalPrice)}</h2>
                                </div>

                                <span
                                    className={`${styles.statusBadge} ${isDeleted
                                        ? styles.deletedBadge
                                        : styles.activeBadge
                                        }`}
                                >
                                    {isDeleted ? "Deleted" : "Active"}
                                </span>
                            </div>

                            <div className={styles.metaGrid}>
                                <div className={styles.metaItem}>
                                    <span>Customer</span>
                                    <strong>
                                        {getCustomerLabel(
                                            order.user,
                                            order.sessionId,
                                        )}
                                    </strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Order status</span>
                                    <strong>{order.status}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Payment status</span>
                                    <strong>{order.paymentStatus}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Total price</span>
                                    <strong>{formatPrice(order.totalPrice)}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Created</span>
                                    <strong>{formatDateEnglish(order.createdAt)}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Deleted at</span>
                                    <strong>{formatDateEnglish(order.deletedAt)}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Deleted by</span>
                                    <strong>{order.deletedBy ?? "N/A"}</strong>
                                </div>
                            </div>

                            {order.deleteReason && (
                                <div className={styles.reasonBox}>
                                    <span>Delete reason</span>
                                    <p>{order.deleteReason}</p>
                                </div>
                            )}

                            <div className={styles.actions}>
                                {isDeleted ? (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openRestoreModal(order)}
                                        disabled={isRestoring === order._id}
                                    >
                                        {isRestoring === order._id
                                            ? "Restoring..."
                                            : "Restore order"}
                                    </ButtonStd>
                                ) : (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openDeleteModal(order)}
                                        disabled={isDeleting === order._id}
                                    >
                                        Delete order
                                    </ButtonStd>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className={styles.pagination}>
                <ButtonStd
                    variant="secondary"
                    onClick={() =>
                        setPage((currentPage) =>
                            Math.max(currentPage - 1, 1),
                        )
                    }
                    disabled={page <= 1 || isLoading}
                >
                    Previous
                </ButtonStd>

                <span>
                    Page {page} of {totalPages}
                </span>

                <ButtonStd
                    variant="secondary"
                    onClick={() =>
                        setPage((currentPage) =>
                            Math.min(currentPage + 1, totalPages),
                        )
                    }
                    disabled={page >= totalPages || isLoading}
                >
                    Next
                </ButtonStd>
            </div>

            <Modal
                title="Delete order?"
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                actions={
                    <div className={styles.modalActions}>
                        <ButtonStd
                            variant="secondary"
                            onClick={closeDeleteModal}
                            disabled={Boolean(isDeleting)}
                        >
                            Cancel
                        </ButtonStd>

                        <ButtonStd
                            variant="primary"
                            onClick={() => {
                                if (orderToDelete) {
                                    handleDelete(orderToDelete._id);
                                }
                            }}
                            disabled={Boolean(isDeleting)}
                        >
                            {isDeleting ? "Deleting..." : "Yes, delete"}
                        </ButtonStd>
                    </div>
                }
            >
                <div className={styles.modalContent}>
                    <p>
                        You are about to soft delete order{" "}
                        <strong>
                            {orderToDelete ? orderToDelete._id : "this order"}
                        </strong>
                        .
                    </p>

                    <textarea
                        className={styles.textarea}
                        value={deleteReason}
                        placeholder="Optional delete reason"
                        onChange={(event) =>
                            setDeleteReason(event.target.value)
                        }
                    />

                    {deleteError && (
                        <p className={styles.error}>{deleteError}</p>
                    )}
                </div>
            </Modal>

            <Modal
                title="Restore order?"
                isOpen={isRestoreModalOpen}
                onClose={closeRestoreModal}
                actions={
                    <div className={styles.modalActions}>
                        <ButtonStd
                            variant="secondary"
                            onClick={closeRestoreModal}
                            disabled={Boolean(isRestoring)}
                        >
                            Cancel
                        </ButtonStd>

                        <ButtonStd
                            variant="ghost-dark"
                            onClick={() => {
                                if (orderToRestore) {
                                    handleRestore(orderToRestore._id);
                                }
                            }}
                            disabled={Boolean(isRestoring)}
                        >
                            {isRestoring ? "Restoring..." : "Yes, restore"}
                        </ButtonStd>
                    </div>
                }
            >
                <div className={styles.modalContent}>
                    <p>
                        Restore order{" "}
                        <strong>
                            {orderToRestore
                                ? orderToRestore._id
                                : "this order"}
                        </strong>
                        ?
                    </p>

                    {restoreError && (
                        <p className={styles.error}>{restoreError}</p>
                    )}
                </div>
            </Modal>
        </section>
    );
}