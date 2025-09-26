import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { useRawMarkdownContent, } from '../../utils/markdown-utils';

function CopyPage({ pageContent }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef(null);
  const rawMarkdownContent = useRawMarkdownContent();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleCopyPage = async () => {
    try {
      // Get the current page content as markdown
      const markdownContent = pageContent || rawMarkdownContent;
      
      if (markdownContent) {
        copyToClipboard(markdownContent);
        setIsDropdownOpen(false);
      } else {
        console.error('No markdown content available to copy');
      }
    } catch (error) {
      console.error('Error copying page content:', error);
    }
  };

  const handleOpenInChatGPT = () => {
    try {
      const currentUrl = window.location.href;
      const encodedUrl = encodeURIComponent(currentUrl);
      const chatGptUrl = `https://chatgpt.com/?hints=search&prompt=Read+from+${encodedUrl}+so+I+can+ask+questions+about+it.`;
      
      window.open(chatGptUrl, '_blank');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error opening in ChatGPT:', error);
    }
  };


  return (
    <div className={styles.copyPageContainer} ref={dropdownRef}>
      <button
        className={`${styles.copyButton} ${copySuccess ? styles.success : ''}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Copy page options"
      >
        <svg className={styles.copyIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy page
        <svg className={styles.dropdownIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>
      
      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownItem}
            onClick={handleCopyPage}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <div className={styles.dropdownItemContent}>
              <div className={styles.dropdownItemTitle}>Copy page</div>
              <div className={styles.dropdownItemSubtitle}>Copy page as Markdown for LLMs</div>
            </div>
          </button>
          <button
            className={styles.dropdownItem}
            onClick={handleOpenInChatGPT}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <div className={styles.dropdownItemContent}>
              <div className={styles.dropdownItemTitle}>Open in ChatGPT</div>
              <div className={styles.dropdownItemSubtitle}>Ask questions about this page</div>
            </div>
          </button>
        </div>
      )}
      
      {copySuccess && (
        <div className={styles.successMessage}>
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default CopyPage; 
