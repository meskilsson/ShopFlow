import React from 'react';
import styles from "./ProductsContainer.module.css";

type Props = {
  children: React.ReactNode;
};

const ContainerH = ({children}: Props) => {
  return (
    <div className={styles.containerH}>
      {children}
    </div>
  )
}

export default ContainerH