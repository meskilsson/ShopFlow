import styles from "./AdminUsersPage.module.css";
import {
    getAdminUsersRequest,
    deleteAdminUserRequest,
    restoreAdminUserRequest,
} from "@/api/admin";
import { useState, useEffect } from "react";
import Card from "@/components/UI/Card";
import ButtonStd from "@/components/UI/ButtonStd";
import Modal from "@/components/UI/Modal/Modal";

type AdminUser = {
    _id: string;
    name: string;
    email: string;
    username: string;
    role: "buyer" | "seller" | "admin";
    deletedAt: string | null;
    deletedBy: string | null;
    deleteReason: string | null;
    createdAt: string;
    updatedAt: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [restoreError, setRestoreError] = useState("");

    const [isDeleting, setIsDeleting] = useState("");
    const [isRestoring, setIsRestoring] = useState("");

    const [deleteReason, setDeleteReason] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [userToRestore, setUserToRestore] = useState<AdminUser | null>(null);

    const activeUsers = users.filter((user) => !user.deletedAt).length;
    const deletedUsers = users.filter((user) => user.deletedAt).length;

    useEffect(() => {
        setError("");
        setIsLoading(true);

        async function getAdminUsers() {
            try {
                const data = await getAdminUsersRequest(true);

                setUsers(data.users);
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

        getAdminUsers();
    }, []);

    async function handleDelete(userId: string) {
        setDeleteError("");
        setIsDeleting(userId);

        try {
            const data = await deleteAdminUserRequest(userId, deleteReason);

            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user._id === userId ? data.user : user,
                ),
            );

            setDeleteReason("");
            setUserToDelete(null);
            setIsDeleteModalOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                setDeleteError(error.message || "Failed to delete user");
            } else {
                setDeleteError("Something went wrong");
            }
        } finally {
            setIsDeleting("");
        }
    }

    async function handleRestore(userId: string) {
        setRestoreError("");
        setIsRestoring(userId);

        try {
            const data = await restoreAdminUserRequest(userId);

            setUsers((currentUsers) =>
                currentUsers.map((user) =>
                    user._id === userId ? data.user : user,
                ),
            );

            setUserToRestore(null);
        } catch (error) {
            if (error instanceof Error) {
                setRestoreError(error.message || "Failed to restore user");
            } else {
                setRestoreError("Something went wrong");
            }
        } finally {
            setIsRestoring("");
        }
    }

    function openDeleteModal(user: AdminUser) {
        setDeleteError("");
        setDeleteReason("");
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        if (isDeleting) return;

        setDeleteError("");
        setDeleteReason("");
        setUserToDelete(null);
        setIsDeleteModalOpen(false);
    }

    function openRestoreModal(user: AdminUser) {
        setRestoreError("");
        setUserToRestore(user);
    }

    function closeRestoreModal() {
        if (isRestoring) return;

        setRestoreError("");
        setUserToRestore(null);
    }

    if (isLoading) return <p className={styles.stateText}>Loading users...</p>;

    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.kicker}>User management</p>
                    <h1>Admin users</h1>
                    <p>
                        Manage user accounts, inspect soft-deleted users, and
                        restore accounts when needed.
                    </p>
                </div>
            </header>

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <span>Total users</span>
                    <strong>{users.length}</strong>
                </div>

                <div className={styles.summaryCard}>
                    <span>Active users</span>
                    <strong>{activeUsers}</strong>
                </div>

                <div className={styles.summaryCard}>
                    <span>Deleted users</span>
                    <strong>{deletedUsers}</strong>
                </div>
            </div>

            {restoreError && <p className={styles.error}>{restoreError}</p>}

            <div className={styles.usersGrid}>
                {users.map((user) => {
                    const isDeleted = Boolean(user.deletedAt);

                    return (
                        <Card
                            key={user._id}
                            variant="default"
                            className={`${styles.userCard} ${isDeleted ? styles.deleted : ""
                                }`}
                        >
                            <div className={styles.userHeader}>
                                <div>
                                    <p className={styles.userId}>{user._id}</p>
                                    <h2>{user.name}</h2>
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
                                    <span>Email</span>
                                    <strong>{user.email}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Username</span>
                                    <strong>{user.username}</strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Role</span>
                                    <strong className={styles.roleBadge}>
                                        {user.role}
                                    </strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Created</span>
                                    <strong>
                                        {new Date(
                                            user.createdAt,
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Deleted at</span>
                                    <strong>
                                        {user.deletedAt
                                            ? new Date(
                                                user.deletedAt,
                                            ).toLocaleDateString()
                                            : "Not deleted"}
                                    </strong>
                                </div>

                                <div className={styles.metaItem}>
                                    <span>Deleted by</span>
                                    <strong>{user.deletedBy ?? "N/A"}</strong>
                                </div>
                            </div>

                            {user.deleteReason && (
                                <div className={styles.reasonBox}>
                                    <span>Delete reason</span>
                                    <p>{user.deleteReason}</p>
                                </div>
                            )}

                            <div className={styles.actions}>
                                {isDeleted ? (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openRestoreModal(user)}
                                        disabled={isRestoring === user._id}
                                    >
                                        {isRestoring === user._id
                                            ? "Restoring..."
                                            : "Restore user"}
                                    </ButtonStd>
                                ) : (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openDeleteModal(user)}
                                        disabled={isDeleting === user._id}
                                    >
                                        Delete user
                                    </ButtonStd>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Modal
                title="Delete account?"
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
                            variant="ghost-dark"
                            onClick={() => {
                                if (userToDelete) {
                                    handleDelete(userToDelete._id);
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
                            {userToDelete ? userToDelete.email : "this user"}
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
                title="Restore account?"
                isOpen={Boolean(userToRestore)}
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
                                if (userToRestore) {
                                    handleRestore(userToRestore._id);
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
                            {userToRestore
                                ? userToRestore.email
                                : "this user"}
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