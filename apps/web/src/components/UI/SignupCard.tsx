import type { ReactNode } from "react";
import styles from "./SignupCard.module.css";

type SignupCardProps = {
    title?: string;
    children: ReactNode;
    className?: string;
};

export default function SignupCard({
    title,
    children,
    className = "",
}: SignupCardProps) {
    return (
        <div className={`${styles.card} ${className}`.trim()}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <div className={styles.content}>{children}</div>
        </div>
    );
}