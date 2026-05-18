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
import { getErrorMessage } from "@/utils/getErrorMessage";
import styles from "./AddressSection.module.css";

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
      .catch((error: unknown) => {
        setError(getErrorMessage(error));
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
          fullName: addressData.fullName,
          street: addressData.street,
          city: addressData.city,
          postalCode: addressData.postalCode,
          country: addressData.country,
        })
        : await createAddress({
          ...addressData,
          type: "shipping",
        });

      setShippingAddress(savedAddress);
    } catch (error) {
      setError(getErrorMessage(error));
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
      setError(getErrorMessage(error));
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
        error={error}
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

    </section>
  );
}
