import styles from "./styles.module.css";
import { Link } from "@docusaurus/Link";

/**
 * Feedback component to handle visitor feedback for the current docs page.
 * @returns {void}
 */

export const Feedback = () => {
  return (
    <div className={styles.feedbackContainer}>
      <h2 className={styles.feedbackHeader}>Was this page helpful?</h2>
      <form>
        <div className={styles.feedbackButtons}>
          <button className={styles.feedbackButton}>Yes</button>
          <button className={styles.feedbackButton}>No</button>
        </div>
      </form>
    </div>
  );
};
