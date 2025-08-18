import { useState } from "react";
import Link from "@docusaurus/Link";
import { ThumbsUp } from "./ThumbsUp";
import { ThumbsDown } from "./ThumbsDown";
import styles from "./styles.module.css";

/**
 * Feedback component to handle visitor feedback for the current docs page.
 * @returns {void}
 */

export const Feedback = () => {
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleFeedbackSubmit = async (feedbackValue) => {
    setSubmissionStatus("loading");

    try {
      const response = await fetch(
        'http://localhost:3000/api/submit-feedback',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_positive: feedbackValue,
            page_url: window.location.href,
          }),
        }
      );

      // If error, set submission status to error and throw error
      if (response.error) {
        throw new Error(response.error);
      }

      // If success, set submission status to success
      setSubmissionStatus("success");
    } catch (error) {
      setSubmissionStatus("error");
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      <h2 className={styles.feedbackHeader}>Was this page helpful?</h2>
      <div className={styles.feedbackButtons}>
        <button 
          className={styles.feedbackButton}
          onClick={() => handleFeedbackSubmit(true)}
        >
          <ThumbsUp />
          Yes
        </button>
        <button 
          className={styles.feedbackButton}
          onClick={() => handleFeedbackSubmit(false)}
        >
          <ThumbsDown />
          No
        </button>
        {submissionStatus === "loading" ? (
          <span className={styles.feedbackMessage}>
            Submitting feedback...
          </span>
          ) : submissionStatus === "success" ? (
          <span className={styles.feedbackMessage}>Thank you for your feedback!</span>
        ) : submissionStatus === "error" ? (
          <span className={styles.feedbackMessage}>
            Error submitting feedback. Please try again.
          </span>
        ) : null}
      </div>
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
