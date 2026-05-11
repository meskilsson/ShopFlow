import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/containers/Container";
import ButtonStd from "@/components/UI/ButtonStd";
import { useAuth } from "@/contexts/AuthContext";
import AddressSection from "@/features/address/AddressSection";
import CheckoutStepper from "@/features/checkout/CheckoutStepper";
import BackIcon from "@/assets/icons/angle-left-solid-full.svg?react"; // ← NYTT
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [continueAsGuest, setContinueAsGuest] = useState(false);

  const shouldShowAddressForm = isAuthenticated || continueAsGuest;

  return (
    <Container>
      <div className={styles.page}>
        <CheckoutStepper
          steps={[
            { label: "Address", status: "current" },
            { label: "Payment", status: "locked" },
            { label: "Review", status: "locked" },
          ]}
        />

        <div className={styles.header}>
          <p className={styles.eyebrow}>Checkout</p>
          <h1>Checkout</h1>
          <p className={styles.subtitle}>
            Add shipping details and review your order.
          </p>
        </div>

        <ButtonStd
          variant="secondary"
          fullWidth={false}
          onClick={() => navigate(-1)}
          style={{
            width: "fit-content",
            minWidth: "40px",
            height: "40px",
            padding: "8px",
          }}
        >
          <BackIcon style={{ width: "22px", height: "22px" }} />
        </ButtonStd>

        {isLoading ? (
          <section className={styles.choicePanel}>Checking account...</section>
        ) : shouldShowAddressForm ? (
          <AddressSection />
        ) : (
          <section className={styles.choicePanel}>
            <div className={styles.choiceText}>
              <h2>How would you like to continue?</h2>
              <p>
                Log in to use saved details, or continue as a guest for this
                order.
              </p>
            </div>

            <div className={styles.choiceActions}>
              <ButtonStd variant="primary" onClick={() => navigate("/login")}>
                Log in
              </ButtonStd>
              <ButtonStd
                variant="ghost-dark"
                onClick={() => setContinueAsGuest(true)}
              >
                Continue as guest
              </ButtonStd>
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
