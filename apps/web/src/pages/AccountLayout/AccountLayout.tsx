import Container from "@/components/containers/Container";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import styles from "./AccountLayout.module.css";

import { useAuth } from "@/contexts/AuthContext";
import { getUserByIdRequest } from "@/api/user";
import { useEffect, useState } from "react";

type AccountUser = {
    _id: string;
    name: string;
    email: string;
    role?: string;
};

export default function AccountLayout() {
    const { user: authUser } = useAuth();

    const [name, setName] = useState("");
    const [user, setUser] = useState<AccountUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            if (!authUser?._id) {
                setIsLoading(false);
                return;
            }

            try {
                const user = await getUserByIdRequest(authUser._id);

                setUser(user);
                setName(user.name);
            } catch (error) {
                console.error("Failed to get user:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        getUser();
    }, [authUser?._id]);

    if (isLoading) {
        return (
            <Container>
                <p>Loading account...</p>
            </Container>
        );
    }

    if (!authUser || !user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Container>
            <section className={styles.page}>
                <div className={styles.pageHeader}>
                    <p className={styles.kicker}>My account</p>

                    {name ? (
                        <p className={styles.subtitle}>Welcome back, {name}</p>
                    ) : (
                        <p className={styles.subtitle}>
                            Manage your profile, orders, and addresses.
                        </p>
                    )}
                </div>

                <div className={styles.accountLayout}>
                    <aside className={styles.sideNav}>
                        <h3 className={styles.header}>Account</h3>

                        <nav className={styles.links}>
                            <NavLink
                                to="/profile"
                                end
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.link} ${styles.activeLink}`
                                        : styles.link
                                }
                            >
                                Profile
                            </NavLink>

                            <NavLink
                                to="/profile/settings"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.link} ${styles.activeLink}`
                                        : styles.link
                                }
                            >
                                Settings
                            </NavLink>

                            <NavLink
                                to="/profile/address"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.link} ${styles.activeLink}`
                                        : styles.link
                                }
                            >
                                Address
                            </NavLink>

                            <NavLink
                                to="/profile/orders"
                                className={({ isActive }) =>
                                    isActive
                                        ? `${styles.link} ${styles.activeLink}`
                                        : styles.link
                                }
                            >
                                Orders
                            </NavLink>
                        </nav>
                    </aside>

                    <main className={styles.content}>
                        <Outlet />
                    </main>
                </div>
            </section>
        </Container>
    );
}