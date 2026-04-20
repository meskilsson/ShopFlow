import React from 'react';
import styles from "./Container.module.css";

type Props = {
  children: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}

export default Container