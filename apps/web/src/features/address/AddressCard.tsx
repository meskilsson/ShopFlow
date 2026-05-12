import { X } from "lucide-react";
import type { Address } from "./address.types";
import styles from "./AddressCard.module.css";

type AddressCardProps = {
  address: Address;
  removing?: boolean;
  onRemove: () => void;
};

export default function AddressCard({
  address,
  removing = false,
  onRemove,
}: AddressCardProps) {
  return (
    <div className={styles.card}>
      <button
        className={styles.removeButton}
        type="button"
        aria-label="Remove saved shipping address"
        disabled={removing}
        onClick={onRemove}
      >
        <X className={styles.removeIcon} aria-hidden="true" />
      </button>
      <p className={styles.label}>Saved shipping address</p>
      {address.fullName ? <p>{address.fullName}</p> : null}
      <p>{address.street}</p>
      <p>
        {address.postalCode} {address.city}
      </p>
      <p>{address.country}</p>
    </div>
  );
}
