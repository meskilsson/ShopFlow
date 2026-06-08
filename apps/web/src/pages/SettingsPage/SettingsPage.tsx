import { deleteMyAccountRequest, getUserDataRequest } from "@/api/user";
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
        setIsDeleting(true);

        try {
            await deleteMyAccountRequest();

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

    async function handleDownloadMyData() {
        const data = await getUserDataRequest();

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "my-shopflow-data.json";
        link.click();

        URL.revokeObjectURL(url);
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


                    <section className={styles.section}>
                        <div>
                            <h2>Download my data</h2>
                            <p>Download a copy of the personal data connected to your account.</p>
                        </div>
                        <ButtonStd
                            variant="primary"
                            onClick={handleDownloadMyData}
                        >Download Data</ButtonStd>
                    </section>


                    <section className={`${styles.section} ${styles.dangerZone}`}>
                        <div>
                            <h2>Delete account</h2>
                            <p>
                                Delete your account and remove or anonymize personal data connected to it.
                                Some order records may be kept for administrative reasons.
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
                <p>This will delete your account.</p>

                {deleteError && <p className={styles.error}>{deleteError}</p>}
            </Modal>
        </Container>
    );
}