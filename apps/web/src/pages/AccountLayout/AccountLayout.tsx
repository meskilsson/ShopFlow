import Container from "@/components/containers/Container";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./AccountLayout.module.css";

import { useAuth } from "@/contexts/AuthContext";
import { getUserByIdRequest } from "@/api/user";
import { useEffect, useState } from "react";

export default function AccountLayout() {
    const { user: authUser } = useAuth();

    const [name, setName] = useState("");

    useEffect(() => {
        async function getUser() {
            if (!authUser?._id) return;

            try {
                const user = await getUserByIdRequest(authUser._id);

                setName(user.name);
            } catch (error) {
                console.error("Failed to get user:", error);
            }
        }

        getUser();
    }, [authUser?._id]);

    return (
        <Container>
            <section className={styles.page}>
                <div className={styles.pageHeader}>
                    <p className={styles.kicker}>My account</p>

                    {name && (
                        <p className={styles.subtitle}>Welcome back, {name}</p>
                    )}

                    {!name && (
                        <p className={styles.subtitle}>
                            Manage your profile, orders, addresses and returns.
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
                                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                                }
                            >
                                Profile
                            </NavLink>

                            <NavLink
                                to="/profile/settings"
                                className={({ isActive }) =>
                                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                                }
                            >
                                Settings
                            </NavLink>

                            <NavLink
                                to="/profile/address"
                                className={({ isActive }) =>
                                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                                }
                            >
                                Address
                            </NavLink>

                            <NavLink
                                to="/profile/orders"
                                className={({ isActive }) =>
                                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                                }
                            >
                                Orders
                            </NavLink>

                            <NavLink
                                to="/profile/returns"
                                className={({ isActive }) =>
                                    isActive ? `${styles.link} ${styles.activeLink}` : styles.link
                                }
                            >
                                Returns
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