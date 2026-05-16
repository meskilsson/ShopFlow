import { Outlet, Navigate, NavLink } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
    const { user, isLoading } = useAuth();
    const isAdmin = user?.role === "admin";

    if (isLoading) {
        return <p className={styles.loading}>Loading...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className={styles.page}>
            <header className={styles.pageHeader}>
                <p className={styles.kicker}>Admin panel</p>
                <h1 className={styles.title}>ShopFlow management</h1>
                <p className={styles.subtitle}>
                    Manage users, products, orders, and soft-deleted records.
                </p>
            </header>

            <div className={styles.adminLayout}>
                <aside className={styles.sideNav}>
                    <h3 className={styles.navHeader}>Admin</h3>

                    <nav className={styles.links}>
                        <NavLink
                            to="/admin/users"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.link} ${styles.activeLink}`
                                    : styles.link
                            }
                        >
                            Users
                        </NavLink>

                        <NavLink
                            to="/admin/products"
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.link} ${styles.activeLink}`
                                    : styles.link
                            }
                        >
                            Products
                        </NavLink>

                        <NavLink
                            to="/admin/orders"
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
    );
}