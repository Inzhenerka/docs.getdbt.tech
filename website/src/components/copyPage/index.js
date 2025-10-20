import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { useRawMarkdownContent, } from '../../utils/markdown-utils';

// Configuration for different LLM services
const LLM_SERVICES = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chatgpt.com/?hints=search&prompt=Read+from+{url}+so+I+can+ask+questions+about+it.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15,3 21,3 21,9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    ),
    subtitle: 'Ask questions about this page'
  },
  claude: {
    name: 'Claude',
    url: 'https://claude.ai/?prompt=Read+from+{url}+so+I+can+ask+questions+about+it.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15,3 21,3 21,9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    ),
    subtitle: 'Ask questions about this page'
  }
};

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

  const handleOpenInLLM = (serviceKey) => {
    try {
      const service = LLM_SERVICES[serviceKey];
      if (!service) {
        console.error(`Unknown LLM service: ${serviceKey}`);
        return;
      }

      const currentUrl = window.location.href;
      const encodedUrl = encodeURIComponent(currentUrl);
      const llmUrl = service.url.replace('{url}', encodedUrl);
      
      window.open(llmUrl, '_blank');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error(`Error opening in ${serviceKey}:`, error);
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
          {Object.entries(LLM_SERVICES).map(([serviceKey, service]) => (
            <button
              key={serviceKey}
              className={styles.dropdownItem}
              onClick={() => handleOpenInLLM(serviceKey)}
            >
              {service.icon}
              <div className={styles.dropdownItemContent}>
                <div className={styles.dropdownItemTitle}>Open in {service.name}</div>
                <div className={styles.dropdownItemSubtitle}>{service.subtitle}</div>
              </div>
            </button>
          ))}
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
