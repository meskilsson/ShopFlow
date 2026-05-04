import Container from "@/components/containers/Container";
import ButtonStd from "@/components/UI/ButtonStd";
import { useNavigate } from "react-router-dom";
import { getUserByIdRequest } from "@/api/user";
import { useAuth } from "@/contexts/AuthContext";

import type { User } from "@/types/userTypes";

import { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            try {
                if (!authUser?._id) {
                    setError("No logged in user found.");
                    return;
                }

                const userData = await getUserByIdRequest(authUser._id);
                setUser(userData);
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

        getUser();
    }, [authUser?._id]);

    if (isLoading) {
        return (
            <Container>
                <div className={styles.stateCard}>
                    <p>Loading profile...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className={styles.errorCard}>
                    <p>{error}</p>
                </div>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container>
                <div className={styles.stateCard}>
                    <p>No user found.</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className={styles.profilePage}>
                <div className={styles.header}>
                    <p className={styles.kicker}>Profile</p>
                    <h1 className={styles.title}>Account overview</h1>
                    <p className={styles.subtitle}>
                        View your personal details and account information.
                    </p>
                </div>

                <section className={styles.summaryCard}>
                    <div>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </div>

                    <ButtonStd
                        variant="secondary"
                        onClick={() => navigate("/profile/settings")}
                    >
                        Edit details
                    </ButtonStd>
                </section>

                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>Personal details</h2>
                        <p>Your basic account information.</p>
                    </div>

                    <div className={styles.detailsList}>
                        <div className={styles.detailRow}>
                            <span>Name</span>
                            <strong>{user.name}</strong>
                        </div>

                        <div className={styles.detailRow}>
                            <span>Email</span>
                            <strong>{user.email}</strong>
                        </div>

                        <div className={styles.detailRow}>
                            <span>Username</span>
                            <strong>@{user.username}</strong>
                        </div>

                        <div className={styles.detailRow}>
                            <span>Role</span>
                            <strong>{user.role}</strong>
                        </div>
                    </div>
                </section>


            </div>
        </Container>
    );
}