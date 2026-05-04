import { deleteUserRequest } from "@/api/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/containers/Container";
import ButtonStd from "@/components/UI/ButtonStd";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/UI/Modal/Modal";
import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import UpdateAccountForm from "@/components/Forms/UpdateAccountForm";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user: authUser, logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDeleteAccount() {
        setError("");

        if (!authUser?._id) {
            setError("No logged in user found.");
            return;
        }

        setIsDeleting(true);

        try {
            await deleteUserRequest(authUser._id);

            setIsOpen(false);

            logout();
            navigate("/home");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Container>
            <div className={styles.settingsPage}>
                <div className={styles.header}>
                    <p className={styles.kicker}>Settings</p>
                    <h1 className={styles.title}>Account settings</h1>
                    <p className={styles.subtitle}>
                        Manage your account details, password, and account deletion.
                    </p>
                </div>

                <div className={styles.sections}>
                    <UpdateAccountForm />
                    <ChangePasswordForm />

                    <section className={`${styles.section} ${styles.dangerZone}`}>
                        <div>
                            <h2>Delete account</h2>
                            <p>
                                Permanently delete your account and all account data.
                            </p>
                        </div>

                        <ButtonStd
                            variant="ghost-dark"
                            onClick={() => setIsOpen(true)}
                        >
                            Delete Account
                        </ButtonStd>
                    </section>
                </div>
            </div>

            <Modal
                title="Delete account?"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                actions={
                    <>
                        <ButtonStd
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
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

                <p className={styles.warning}>
                    This action cannot be undone.
                </p>

                {error && <p className={styles.error}>{error}</p>}
            </Modal>
        </Container>
    );
}