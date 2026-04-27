import Container from "@/components/containers/Container";
import { NavLink, Outlet } from "react-router-dom";
import styles from './AccountLayout.module.css'

export default function AccountLayout() {
    return (
        <Container>
            <h1>THIS IS THE PROFILE PAGE</h1>

            <div className={styles.accountLayout}>
                <div className={styles.sideNav}>
                    <h3 className={styles.header}>Ditt konto</h3>

                    <div className={styles.links}>
                        <NavLink to="/profile/settings">Settings</NavLink>
                        <NavLink to="/profile/address">Address</NavLink>
                        <NavLink to="/profile/orders">Orders</NavLink>
                        <NavLink to="/profile/returns">Returns</NavLink>
                    </div>
                </div>

                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </Container>
    );
}