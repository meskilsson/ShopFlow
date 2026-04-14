import React from 'react';
import styles from "./MainContainer.module.css";

type Props = {
  children: React.ReactNode;
};

const MainContainer = ({ children }: Props) => {
  return (
    <div className={styles.mainContainer}>
      {children}
    </div>
  )
}

export default MainContainer