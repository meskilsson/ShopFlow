import type { ReactNode } from "react";
import styles from './LoginCard.module.css';

export type LoginCardProps = {
    title?: string;
    children: ReactNode;
    className?: string;
};

export default function LoginCard({
    title,
    children,
    className = "",
}: LoginCardProps) {
    return (
        <div className={`${styles.card} ${className}`.trim()}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <div className={styles.content}>{children}</div>
        </div>
    )
}

