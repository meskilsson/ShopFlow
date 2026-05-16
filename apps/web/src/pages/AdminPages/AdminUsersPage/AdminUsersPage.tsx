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

            setUserToRestore(null)
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

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>Admin users</h1>
                    <p>Manage users, roles and soft-deleted accounts.</p>
                </div>
            </header>

            {restoreError && <p className={styles.error}>{restoreError}</p>}

            <div className={styles.placeholder}>
                <div>
                    {users.map((user) => (
                        <div key={user._id}>
                            <Card
                                variant="default"
                                className={user.deletedAt ? styles.deleted : ""}
                            >
                                <h3>User id: {user._id}</h3>
                                <p>Name: {user.name}</p>
                                <p>Email: {user.email}</p>
                                <p>Username: {user.username}</p>
                                <p>Role: {user.role}</p>
                                <p>Created at: {user.createdAt}</p>
                                <p>
                                    Deleted at:{" "}
                                    {user.deletedAt ?? "Not deleted"}
                                </p>
                                <p>Deleted by: {user.deletedBy ?? "N/A"}</p>
                                <p>
                                    Delete reason:{" "}
                                    {user.deleteReason ?? "N/A"}
                                </p>

                                {user.deletedAt ? (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openRestoreModal(user)}
                                        disabled={isRestoring === user._id}
                                    >
                                        {isRestoring === user._id
                                            ? "Restoring..."
                                            : "Restore User"}
                                    </ButtonStd>
                                ) : (
                                    <ButtonStd
                                        variant="primary"
                                        onClick={() => openDeleteModal(user)}
                                        disabled={isDeleting === user._id}
                                    >
                                        Delete User
                                    </ButtonStd>
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                title="Delete account?"
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                actions={
                    <>
                        <textarea
                            value={deleteReason}
                            placeholder="Delete reason"
                            onChange={(event) =>
                                setDeleteReason(event.target.value)
                            }
                        />

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
                    </>
                }
            >
                <p>
                    Soft delete{" "}
                    {userToDelete ? userToDelete.email : "this user"}.
                </p>

                {deleteError && <p className={styles.error}>{deleteError}</p>}
            </Modal>
            <Modal
                title="Restore account?"
                isOpen={Boolean(userToRestore)}
                onClose={closeRestoreModal}
                actions={
                    <>
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
                    </>
                }
            >
                <p>
                    Restore{" "}
                    {userToRestore ? userToRestore.email : "this user"}?
                </p>

                {restoreError && <p className={styles.error}>{restoreError}</p>}
            </Modal>

        </section>
    );
}