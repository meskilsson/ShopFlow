import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "@/api/address";
import ButtonStd from "@/components/UI/ButtonStd";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import type { Address, CreateAddressData } from "./address.types";
import styles from "./AddressSection.module.css";

type ApiError = Error & {
  status?: number;
};

export default function AddressSection() {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAddresses()
      .then((addresses) => {
        const existingShippingAddress =
          addresses.find((address) => address.type === "shipping") ?? null;

        setShippingAddress(existingShippingAddress);
      })
      .catch((error: ApiError) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSaveAddress(addressData: CreateAddressData) {
    setSaving(true);
    setError("");

    try {
      const savedAddress = shippingAddress
        ? await updateAddress(shippingAddress._id, {
            full_name: addressData.full_name,
            street: addressData.street,
            city: addressData.city,
            postal_code: addressData.postal_code,
            country: addressData.country,
          })
        : await createAddress({
            ...addressData,
            type: "shipping",
          });

      setShippingAddress(savedAddress);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save address",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveAddress() {
    if (!shippingAddress) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await deleteAddress(shippingAddress._id);
      setShippingAddress(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not remove address",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <section className={styles.section}>Loading address...</section>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Shipping address</h2>
        <p>Where should we send your order?</p>
      </div>

      {shippingAddress ? (
        <AddressCard
          address={shippingAddress}
          removing={saving}
          onRemove={handleRemoveAddress}
        />
      ) : null}

      <AddressForm
        address={shippingAddress}
        saving={saving}
        onSubmit={handleSaveAddress}
      />

      {shippingAddress ? (
        <div className={styles.actions}>
          <ButtonStd
            variant="primary"
            fullWidth
            onClick={() =>
              navigate("/order", {
                state: { selectedAddress: shippingAddress },
              })
            }
          >
            Continue to order
          </ButtonStd>
        </div>
      ) : null}

      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  );
}
