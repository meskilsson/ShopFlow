import { Check, Lock } from "lucide-react";
import styles from "./CheckoutStepper.module.css";

export type CheckoutStepStatus = "complete" | "current" | "locked";

export type CheckoutStep = {
  label: string;
  status: CheckoutStepStatus;
};

type CheckoutStepperProps = {
  steps: CheckoutStep[];
};

export default function CheckoutStepper({ steps }: CheckoutStepperProps) {
  return (
    <nav className={styles.stepper} aria-label="Checkout progress">
      {steps.map((step, index) => (
        <div
          className={`${styles.step} ${styles[step.status]}`}
          key={step.label}
          aria-current={step.status === "current" ? "step" : undefined}
        >
          <span className={styles.marker}>
            {step.status === "complete" ? (
              <Check aria-hidden="true" size={16} />
            ) : step.status === "locked" ? (
              <Lock aria-hidden="true" size={14} />
            ) : (
              index + 1
            )}
          </span>
          <span className={styles.label}>{step.label}</span>
        </div>
      ))}
    </nav>
  );
}
