import {
    getAdminProductsRequest,
    deleteAdminProductRequest,
    restoreAdminProductRequest,
} from "@/api/admin.product";
import styles from "./AdminProductPage.module.css";
import { useState, useEffect } from "react";
import Modal from "@/components/UI/Modal/Modal";
import ButtonStd from "@/components/UI/ButtonStd";
import Card from "@/components/UI/Card";
import { formatDateEnglish } from "@/utils/formatDateEnglish";
import { formatPrice } from "@/utils/formatPrice";

export type ProductCategory =
    | "T-Shirts"
    | "Shoes"
    | "Pants"
    | "Shirts"
    | "Jackets"
    | "Accessories";

export interface Product {
    _id: string;
    name: string;
    price: number;
    category: ProductCategory;
    ProductImage?: string;
    deletedAt?: string | null;
    deletedBy?: string | null;
    deleteReason?: string | null;
    createdAt?: string;
    updatedAt?: string;
}




export default function AdminProductPage() {

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const [products, setProducts] = useState<Product[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState("");
    const [isRestoring, setIsRestoring] = useState("");

    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [restoreError, setRestoreError] = useState("");

    const [deleteReason, setDeleteReason] = useState("");

    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToRestore, setProductToRestore] = useState<Product | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

    const activeProducts = products.filter((product) => !product.deletedAt).length;
    const deletedProducts = products.filter((product) => product.deletedAt).length;

    useEffect(() => {
        async function getAdminProducts() {
            setError("");
            setIsLoading(true);

            try {
                const data = await getAdminProductsRequest({
                    includeDeleted: true,
                    page,
                    limit,
                });

                setProducts(data.products);
                setTotalPages(data.totalPages);
                setTotalProducts(data.totalProducts);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message || "Could not fetch products");
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

        getAdminProducts();
    }, [page, limit]);

    async function handleDelete(productId: string) {
        setDeleteError("");
        setIsDeleting(productId);

        try {
            const data = await deleteAdminProductRequest(productId, deleteReason);
            const updatedProduct = data.product ?? data;

            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product._id === productId ? updatedProduct : product,
                ),
            );

            setDeleteReason("");
            setProductToDelete(null);
            setIsDeleteModalOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                setDeleteError(error.message || "Failed to delete product");
            } else {
                setDeleteError("Something went wrong");
            }
        } finally {
            setIsDeleting("");
        }
    }

    async function handleRestore(productId: string) {
        setRestoreError("");
        setIsRestoring(productId);

        try {
            const data = await restoreAdminProductRequest(productId);
            const updatedProduct = data.product ?? data;

            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product._id === productId ? updatedProduct : product,
                ),
            );

            setProductToRestore(null);
            setIsRestoreModalOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                setRestoreError(error.message || "Failed to restore product");
            } else {
                setRestoreError("Something went wrong");
            }
        } finally {
            setIsRestoring("");
        }
    }

    function openDeleteModal(product: Product) {
        setDeleteError("");
        setDeleteReason("");
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        if (isDeleting) return;

        setDeleteError("");
        setDeleteReason("");
        setProductToDelete(null);
        setIsDeleteModalOpen(false);
    }

    function openRestoreModal(product: Product) {
        setRestoreError("");
        setProductToRestore(product);
        setIsRestoreModalOpen(true);
    }

    function closeRestoreModal() {
        if (isRestoring) return;

        setRestoreError("");
        setProductToRestore(null);
        setIsRestoreModalOpen(false);
    }

    if (isLoading) return <p className={styles.stateText}>Loading products...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>Product management</p>
                    <h1>Admin products</h1>
                    <p>
                        Manage products, inspect soft-deleted products, and
                        restore products when needed.
                    </p>
                </div>
            </header>

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <span>Total products</span>
                    <strong>{totalProducts}</strong>
                </div>

                <div className={styles.summaryCard}>
                    <span>Active products</span>
                    <strong>{activeProducts}</strong>
                </div>

                <div className={styles.summaryCard}>
                    <span>Deleted products</span>
                    <strong>{deletedProducts}</strong>
                </div>
            </div>

            {restoreError && <p className={styles.error}>{restoreError}</p>}

            <div className={styles.productsGrid}>
                {products.map((product) => {
                    const isDeleted = Boolean(product.deletedAt);

                    return (
                        <Card
                            key={product._id}
                            variant="default"
                            className={`${styles.productCard} ${isDeleted ? styles.deleted : ""
                                }`}
                        >
                            <div className={styles.productHeader}>
                                <div>
                                    <p className={styles.productId}>
                                        {product._id}
                                    </p>
                                    <h2>{product.name}</h2>
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

                            <div className={styles.imageFrame}>
                                {product.ProductImage ? (
                                    <img
                                        src={product.ProductImage}
                                        alt={product.name}
                                    />
                                ) : (
                                    <div className={styles.noImage}>
                                        No image
                                    </div>
                                )}
                            </div>

                            <div className={styles.metaGrid}>
                                <div className={styles.metaItem}>
                                    <span>Category</span>
                                    <strong>{product.category}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Price</span>
                                    <strong>{formatPrice(product.price)}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Created</span>
                                    <strong>{formatDateEnglish(product.createdAt)}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Deleted at</span>
                                    <strong>{formatDateEnglish(product.deletedAt)}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Deleted by</span>
                                    <strong>{product.deletedBy ?? "N/A"}</strong>
                                </div>
                            </div>

                            {product.deleteReason && (
                                <div className={styles.reasonBox}>
                                    <span>Delete reason</span>
                                    <p>{product.deleteReason}</p>
                                </div>
                            )}

                            <div className={styles.actions}>
                                {isDeleted ? (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openRestoreModal(product)}
                                        disabled={isRestoring === product._id}
                                    >
                                        {isRestoring === product._id
                                            ? "Restoring..."
                                            : "Restore product"}
                                    </ButtonStd>
                                ) : (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openDeleteModal(product)}
                                        disabled={isDeleting === product._id}
                                    >
                                        Delete product
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
                    onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
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
                        setPage((currentPage) => Math.min(currentPage + 1, totalPages))
                    }
                    disabled={page >= totalPages || isLoading}
                >
                    Next
                </ButtonStd>
            </div>

            <Modal
                title="Delete product?"
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
                                if (productToDelete) {
                                    handleDelete(productToDelete._id);
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
                        You are about to soft delete{" "}
                        <strong>
                            {productToDelete
                                ? productToDelete.name
                                : "this product"}
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
                title="Restore product?"
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
                                if (productToRestore) {
                                    handleRestore(productToRestore._id);
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
                        Restore{" "}
                        <strong>
                            {productToRestore
                                ? productToRestore.name
                                : "this product"}
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