import React from 'react';
import styles from './styles.module.css';

const IntroText = ({ children }) => {
  return (
    <div className={styles.introText}>
      {children}
    </div>
  );
};

export default IntroText;
