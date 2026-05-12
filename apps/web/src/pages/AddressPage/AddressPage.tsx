import { useEffect, useState } from "react";
import { getAddresses } from "@/api/address";
import { useAuth } from "@/contexts/AuthContext";

import ChangeAddressForm from "@/components/Forms/ChangeAddressForm";
import Container from "@/components/containers/Container";
import Card from "@/components/UI/Card";

import { type Address } from "@/features/address/address.types";
import styles from "./AddressPage.module.css";

export default function AddressPage() {
    const { user: authUser } = useAuth();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadAddresses() {
            try {
                setIsLoading(true);
                setError("");

                if (!authUser?._id) {
                    setAddresses([]);
                    setError("You need to be logged in to view your addresses.");
                    return;
                }

                const addressData = await getAddresses();
                setAddresses(addressData);
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

        loadAddresses();
    }, [authUser?._id]);

    return (
        <Container>
            <main className={styles.addressPage}>
                <header className={styles.header}>
                    <div>
                        <p className={styles.kicker}>Account</p>
                        <h1>Addresses</h1>
                        <p className={styles.subtitle}>
                            View and manage the addresses connected to your account.
                        </p>
                    </div>

                    <span className={styles.addressCount}>
                        {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
                    </span>
                </header>

                {isLoading && (
                    <Card>
                        <div className={styles.stateBox}>
                            <p>Loading addresses...</p>
                        </div>
                    </Card>
                )}

                {!isLoading && error && (
                    <Card>
                        <div className={styles.errorBox}>
                            <p>{error}</p>
                        </div>
                    </Card>
                )}

                {!isLoading && !error && addresses.length === 0 && (
                    <Card>
                        <div className={styles.emptyBox}>
                            <h2>No addresses found</h2>
                            <p>Your saved addresses will appear here.</p>
                        </div>
                    </Card>
                )}

                {!isLoading && !error && addresses.length > 0 && (
                    <>
                        <Card>
                            <section className={styles.addressList}>
                                {addresses.map((address) => (
                                    <article key={address._id} className={styles.addressCard}>
                                        <div className={styles.addressTop}>
                                            <h2>{address.type}</h2>
                                            <span className={styles.badge}>{address.type}</span>
                                        </div>

                                        <div className={styles.addressDetails}>
                                            <p>{address.street}</p>
                                            <p>
                                                {address.postalCode} {address.city}
                                            </p>
                                            <p>{address.country}</p>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        </Card>

                        <Card>
                            <section className={styles.formSection}>
                                <div className={styles.formHeader}>
                                    <h2>Edit addresses</h2>
                                    <p>Update your saved shipping or billing information.</p>
                                </div>

                                <div className={styles.forms}>
                                    {addresses.map((address) => (
                                        <ChangeAddressForm key={address._id} address={address} />
                                    ))}
                                </div>
                            </section>
                        </Card>
                    </>
                )}
            </main>
        </Container>
    );
}
