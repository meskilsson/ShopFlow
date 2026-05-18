import { useEffect, useState, type FormEvent } from "react";
import ButtonStd from "../UI/ButtonStd";
import type {
    Address,
    UpdateAddressData,
} from "@/features/address/address.types";
import { updateAddress } from "@/api/address";
import styles from "./ChangeAddressForm.module.css";

type ChangeAddressProp = {
    address: Address;
};

function getInitialFormData(address: Address): UpdateAddressData {
    return {
        fullName: address.fullName,
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
    };
}

export default function ChangeAddressForm({ address }: ChangeAddressProp) {
    const [formData, setFormData] = useState<UpdateAddressData>(() =>
        getInitialFormData(address)
    );

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData(getInitialFormData(address));
    }, [address]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!address._id) {
            setError("No address id found.");
            return;
        }

        setIsLoading(true);

        try {
            const updatedAddress = await updateAddress(address._id, formData);

            setFormData(getInitialFormData(updatedAddress));
            setSuccess("Address successfully updated.");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <div>
                    <p className={styles.kicker}>{address.type}</p>
                    <h2 className={styles.formTitle}>Update address</h2>
                </div>

                <span className={styles.badge}>{address.type}</span>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor={`fullName-${address._id}`} className={styles.label}>
                        Full name
                    </label>
                    <input
                        id={`fullName-${address._id}`}
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                            }))
                        }
                        className={styles.input}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor={`street-${address._id}`} className={styles.label}>
                        Street
                    </label>
                    <input
                        id={`street-${address._id}`}
                        type="text"
                        value={formData.street}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                street: e.target.value,
                            }))
                        }
                        className={styles.input}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor={`city-${address._id}`} className={styles.label}>
                            City
                        </label>
                        <input
                            id={`city-${address._id}`}
                            type="text"
                            value={formData.city}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    city: e.target.value,
                                }))
                            }
                            className={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label
                            htmlFor={`postalCode-${address._id}`}
                            className={styles.label}
                        >
                            Postal code
                        </label>
                        <input
                            id={`postalCode-${address._id}`}
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    postalCode: e.target.value,
                                }))
                            }
                            className={styles.input}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor={`country-${address._id}`} className={styles.label}>
                        Country
                    </label>
                    <input
                        id={`country-${address._id}`}
                        type="text"
                        value={formData.country}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                country: e.target.value,
                            }))
                        }
                        className={styles.input}
                        disabled={isLoading}
                    />
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <div className={styles.actions}>
                    <ButtonStd variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update address"}
                    </ButtonStd>
                </div>
            </form>
        </section>
    );
}
