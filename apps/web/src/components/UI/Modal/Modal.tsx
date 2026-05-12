import type { ReactNode } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
    title?: string;
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
    actions?: ReactNode;
};

export default function Modal({
    title,
    isOpen,
    onClose,
    children,
    actions,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.panel}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h2 className={styles.title}>{title}</h2>}

                <div className={styles.content}>{children}</div>

                <div className={styles.actions}>{actions}</div>
            </div>
        </div>
    );
}