import Link from "@docusaurus/Link";
import { ThumbsUp } from "./ThumbsUp";
import { ThumbsDown } from "./ThumbsDown";
import styles from "./styles.module.css";

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
          <button className={styles.feedbackButton}>
            <ThumbsUp />
            Yes
          </button>
          <button className={styles.feedbackButton}>
            <ThumbsDown />
            No
          </button>
        </div>
      </form>
      <div className={styles.feedbackLinks}>
        <Link
          href="https://www.getdbt.com/cloud/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy policy
        </Link> 
        <Link
          href="https://github.com/dbt-labs/docs.getdbt.com/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create a GitHub issue
        </Link>
      </div>
    </div>
  );
};
