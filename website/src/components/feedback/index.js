import styles from "./styles.module.css";

/**
 * Feedback component to handle visitor feedback for the current docs page.
 * @returns {void}
 */

export const Feedback = () => {
  return (
    <div className={styles.feedbackContainer}>
      <h2 className={styles.feedbackHeader}>Was this page helpful?</h2>
    </div>
  );
};
