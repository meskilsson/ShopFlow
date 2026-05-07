import { getAddresses } from "@/api/address";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react"

import ChangeAddressForm from "@/components/Forms/ChangeAddressForm";

import Container from "@/components/containers/Container";
import Card from "@/components/UI/Card";
import ButtonStd from "@/components/UI/ButtonStd";

import { type Address } from "@/features/address/address.types";

export default function AddressPage() {

    const { user: authUser } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadAddresses() {
            try {
                if (!authUser?._id) {
                    setIsLoading(false);
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



    if (isLoading) return <p>Loading address..</p>

    if (error) return <p>{error}</p>

    return (
        <Container>
            <div>
                <h1>Addresses</h1>

                {addresses?.length === 0 ? (
                    <p>No addresseses found.</p>
                ) : (
                    addresses?.map((addresses) => (
                        <div key={addresses._id}>
                            <h2>{addresses.type}</h2>
                            <p>{addresses.street}</p>
                            <p>{addresses.city}</p>
                            <p>{addresses.postal_code}</p>
                            <p>{addresses.country}</p>
                        </div>
                    ))
                )}
            </div>

            <Card>
                {addresses.map((address) => (
                    <ChangeAddressForm
                        key={address._id}
                        address={address}
                    />
                ))}
            </Card>

        </Container>
    );
}