import { useState } from "react";
import Link from "@docusaurus/Link";
import { ThumbsUp } from "./ThumbsUp";
import { ThumbsDown } from "./ThumbsDown";
import styles from "./styles.module.css";
import { validateTextInput } from "../../utils/validate-text-input";

/**
 * Feedback component to handle visitor feedback for the current docs page.
 * @returns {void}
 */

export const Feedback = () => {
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [textFeedback, setTextFeedback] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleRatingSelect = (feedbackValue) => {
    if (hasSubmitted) {
      return;
    }
    setSelectedFeedback(feedbackValue);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTextFeedback(newText);

    // Validate input on change
    if (newText.trim()) {
      validateTextInput(newText, setValidationError);
    } else {
      setValidationError("");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent resubmission if already submitted
    if (hasSubmitted) {
      return;
    }

    // Require rating selection
    if (selectedFeedback === null) {
      return;
    }

    // Validate text input before submission
    if (
      textFeedback.trim() &&
      !validateTextInput(textFeedback, setValidationError)
    ) {
      return;
    }

    setSubmissionStatus("loading");

    try {
      // Execute reCAPTCHA
      const token = await window.grecaptcha.execute(
        "6LeIksMrAAAAABYsWNCpUv15lXXzEZj91zdDCymo",
        {
          action: "feedback_submission",
        }
      );

      // Submit feedback to db
      const response = await fetch(
        "https://www.getdbt.com/api/submit-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_positive: selectedFeedback,
            message: textFeedback.trim(),
            page_url: window.location.href,
            recaptcha_token: token,
          }),
        }
      );

      const data = await response.json();

      // If error, set submission status to error and throw error
      if (data?.error) {
        throw new Error(data?.error);
      }

      // If success, set submission status to success
      setSubmissionStatus("success");
      setHasSubmitted(true);
    } catch (error) {
      setSubmissionStatus("error");
    }
  };

  return (
    <div className={styles.feedbackContainer}>
      <h2 id="feedback-header" className={styles.feedbackHeader}>Нашли ошибку?</h2>
      <div>
        <div className={styles.feedbackLinks}>
          <Link
            href="https://github.com/Inzhenerka/docs.getdbt.tech/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Создать GitHub Issue
          </Link>
        </div>
      </div>
    </div>
  );
};
