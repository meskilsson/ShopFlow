import React from 'react';
import styles from "./ContentWrapper.module.css";

type Props = {
  children: React.ReactNode;
};

const ContentWrapper = ({ children }: Props) => {
  return (
    <div className={styles.contentWrapper}>
      {children}
    </div>
  )
}

export default ContentWrapper