import { deleteUserRequest } from "@/api/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "@/components/containers/Container";
import ButtonStd from "@/components/UI/ButtonStd";
import Modal from "@/components/UI/Modal/Modal";
import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import UpdateAccountForm from "@/components/Forms/UpdateAccountForm";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuth();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    function openDeleteModal() {
        setDeleteError("");
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        if (isDeleting) return;

        setDeleteError("");
        setIsDeleteModalOpen(false);
    }

    async function handleDeleteAccount() {
        setDeleteError("");

        if (!authUser?._id) {
            setDeleteError("No logged in user found.");
            return;
        }

        setIsDeleting(true);

        try {
            await deleteUserRequest(authUser._id);

            setIsDeleteModalOpen(false);
            logout();
            navigate("/home");
        } catch (error) {
            if (error instanceof Error) {
                setDeleteError(error.message);
            } else {
                setDeleteError("Something went wrong.");
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Container>
            <main className={styles.settingsPage}>
                <header className={styles.header}>
                    <p className={styles.kicker}>Settings</p>
                    <h1 className={styles.title}>Account settings</h1>
                    <p className={styles.subtitle}>
                        Manage your account details, password, and account deletion.
                    </p>
                </header>

                <div className={styles.sections}>
                    <UpdateAccountForm />

                    <ChangePasswordForm />

                    <section className={`${styles.section} ${styles.dangerZone}`}>
                        <div>
                            <h2>Delete account</h2>
                            <p>
                                Permanently delete your account and all account data. This
                                action cannot be undone.
                            </p>
                        </div>

                        <ButtonStd variant="ghost-dark" onClick={openDeleteModal}>
                            Delete account
                        </ButtonStd>
                    </section>
                </div>
            </main>

            <Modal
                title="Delete account?"
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                actions={
                    <>
                        <ButtonStd
                            variant="secondary"
                            onClick={closeDeleteModal}
                            disabled={isDeleting}
                        >
                            Cancel
                        </ButtonStd>

                        <ButtonStd
                            variant="ghost-dark"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Yes, delete"}
                        </ButtonStd>
                    </>
                }
            >
                <p>This will permanently delete your account.</p>

                <p className={styles.warning}>This action cannot be undone.</p>

                {deleteError && <p className={styles.error}>{deleteError}</p>}
            </Modal>
        </Container>
    );
}