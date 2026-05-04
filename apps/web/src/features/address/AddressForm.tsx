import { useEffect, useState } from "react";
import ButtonStd from "@/components/UI/ButtonStd";
import type { Address, CreateAddressData } from "./address.types";
import styles from "./AddressForm.module.css";

type AddressFormProps = {
  address?: Address | null;
  saving?: boolean;
  onSubmit: (address: CreateAddressData) => void | Promise<void>;
};

const emptyForm: CreateAddressData = {
  full_name: "",
  street: "",
  city: "",
  postal_code: "",
  country: "",
  type: "shipping",
};

export default function AddressForm({
  address,
  saving = false,
  onSubmit,
}: AddressFormProps) {
  const [formData, setFormData] = useState<CreateAddressData>(emptyForm);

  useEffect(() => {
    if (!address) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      full_name: address.full_name ?? "",
      street: address.street,
      city: address.city,
      postal_code: address.postal_code,
      country: address.country,
      type: address.type,
    });
  }, [address]);

  function updateField(field: keyof CreateAddressData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="full_name">Full name</label>
        <input
          id="full_name"
          value={formData.full_name}
          onChange={(event) => updateField("full_name", event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="street">Street</label>
        <input
          id="street"
          value={formData.street}
          onChange={(event) => updateField("street", event.target.value)}
          required
        />
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="postal_code">Postal code</label>
          <input
            id="postal_code"
            value={formData.postal_code}
            onChange={(event) =>
              updateField("postal_code", event.target.value)
            }
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="city">City</label>
          <input
            id="city"
            value={formData.city}
            onChange={(event) => updateField("city", event.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          value={formData.country}
          onChange={(event) => updateField("country", event.target.value)}
          required
        />
      </div>

      <ButtonStd variant="primary" fullWidth className={styles.submitBtn}>
        {saving ? "Saving..." : "Save address"}
      </ButtonStd>
    </form>
  );
}
