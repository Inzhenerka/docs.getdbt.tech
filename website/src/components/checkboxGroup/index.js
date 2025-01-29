import React from 'react';
import styles from './styles.module.css';

export function CheckboxGroup({ options, selectedValues, onChange, label }) {
  const [showAll, setShowAll] = React.useState(false);
  
  const displayedOptions = showAll ? options : options.slice(0, 3);
  const hasMoreOptions = options.length > 3;

  const handleCheckboxChange = (option) => {
    const isCurrentlySelected = selectedValues.some(item => item.value === option.value);
    const newValues = isCurrentlySelected
      ? selectedValues.filter(item => item.value !== option.value)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className={styles.checkboxGroup}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.checkboxContainer}>
        {displayedOptions.map((option) => (
          <label key={option.value} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedValues.some(item => item.value === option.value)}
              onChange={() => handleCheckboxChange(option)}
              className={styles.checkbox}
            />
            {option.label}
          </label>
        ))}
      </div>
      {hasMoreOptions && (
        <button 
          className={styles.viewMoreButton} 
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'View Less' : `View More (${options.length - 3})`}
        </button>
      )}
    </div>
  );
} 
