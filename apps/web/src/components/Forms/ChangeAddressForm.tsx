
import { useState } from "react";
import Container from "../containers/Container";
import Card from "../UI/Card";
import ButtonStd from "../UI/ButtonStd";
import type { Address, UpdateAddressData } from "@/features/address/address.types";
import { updateAddress } from "@/api/address";
import styles from './ChangeAddressForm.module.css';

type ChangeAddressProp = {
    address: Address;
}


export default function ChangeAddressForm({ address }: ChangeAddressProp) {


    const [formData, setFormData] = useState<UpdateAddressData>({
        full_name: address.full_name,
        street: address.street,
        city: address.city,
        postal_code: address.postal_code,
        country: address.country,
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!address?._id) {
            setError("");
            setSuccess("");
        }

        setIsLoading(true);

        try {
            const addressData = await updateAddress(address?._id, formData);

            setFormData(addressData);
            setSuccess("Address successfully updated.");

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

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div className={styles.wrapper}>
            <Card>
                <h2 className={styles.formTitle}>Update address</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="full_name" className={styles.label}>Full Name</label>
                    <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData((prev) => ({
                            ...prev,
                            full_name: e.target.value
                        }))}
                        className={styles.input}
                    />
                    <label htmlFor="street" className={styles.label}>Street</label>
                    <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData((prev) => ({
                            ...prev,
                            street: e.target.value
                        }))}
                        className={styles.input}
                    />
                    <label htmlFor="city" className={styles.label}>City</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({
                            ...prev,
                            city: e.target.value
                        }))}
                        className={styles.input}
                    />
                    <label htmlFor="postal_code" className={styles.label}>Postal Code</label>
                    <input
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) => setFormData((prev) => ({
                            ...prev,
                            postal_code: e.target.value
                        }))}
                        className={styles.input}
                    />
                    <label htmlFor="country" className={styles.label}>Country</label>
                    <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData((prev) => ({
                            ...prev,
                            country: e.target.value
                        }))}
                        className={styles.input}
                    />

                    {error && <p>{error}</p>}
                    {success && <p>{success}</p>}

                    <ButtonStd variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update address"}
                    </ButtonStd>
                </form>
            </Card>
        </div>
    )
}