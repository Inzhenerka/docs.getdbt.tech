import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import QuickstartGuideCard from '../quickstartGuideCard';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';
import { CheckboxGroup } from '../checkboxGroup';
import { frontMatter as CONFIG } from '@site/docs/guides/_config.md?raw';

// Helper function to normalize title into a key
// Eliminates the need to manually update the key for each category
const normalizeTitle = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

// Contains the categorized guides
const GuideSection = ({ title, guides }) => {
  if (!guides || guides.length === 0) return null;
  
  return (
    <div className={styles.guideSection}>
      <h3>{title}</h3>
      <div className={styles.quickstartCardContainer}>
        {guides.map((guide) => (
          <QuickstartGuideCard 
            frontMatter={guide.data} 
            key={guide.data.id || guide.index} 
          />
        ))}
      </div>
    </div>
  )
}

// New filters can be added here following the same pattern as tags and level
// Please reach out to the web team if you have questions
const FILTER_CONFIGS = {
  tags: {
    urlParam: 'tags',
    frontMatterKey: 'tags',
    label: 'Choose a topic',
    isArray: true, // tags is an array in frontmatter
  },
  level: {
    urlParam: 'level',
    frontMatterKey: 'level',
    label: 'Choose a level',
    isArray: false, // level is a single string in frontmatter
  },
  
};

function QuickstartList({ quickstartData }) {
  const { siteConfig } = useDocusaurusContext();
  
  const title = CONFIG?.title;
  const description = CONFIG?.description;
  
  const metaTitle = `${title}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`;

  const [filteredData, setFilteredData] = useState(() => quickstartData);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();

  // Replace individual filter states with a single object
  const getFilterOptions = (filterKey) => {
    const config = FILTER_CONFIGS[filterKey];
    const values = new Set();
    
    quickstartData.forEach(guide => {
      const frontMatterValue = guide?.data?.[config.frontMatterKey];
      if (config.isArray) {
        frontMatterValue?.forEach(value => values.add(value));
      } else if (frontMatterValue) {
        values.add(frontMatterValue);
      }
    });
    
    return Array.from(values)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map(value => ({ value, label: value }));
  };

  // Memoize filter options to prevent unnecessary recalculations
  const filterOptions = useMemo(() => {
    // Iterate through each filter type (tags, level, etc.) defined in FILTER_CONFIGS
    return Object.keys(FILTER_CONFIGS).reduce((acc, filterKey) => ({
      ...acc,
      // For each filter type, generate an array of available options
      // by calling getFilterOptions which extracts unique values from quickstartData
      [filterKey]: getFilterOptions(filterKey)
    }), {});
  }, [quickstartData]);

  const updateUrlParams = (filters) => {
    const params = new URLSearchParams(location.search);
    
    // Clear existing filter params
    Object.keys(FILTER_CONFIGS).forEach(key => {
      params.delete(FILTER_CONFIGS[key].urlParam);
    });

    // Add new filter params
    Object.entries(filters).forEach(([key, selected]) => {
      if (selected?.length > 0) {
        params.set(
          FILTER_CONFIGS[key].urlParam,
          selected.map(item => item.value).join(',')
        );
      }
    });

    const queryString = params.toString();
    const newUrl = queryString 
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.pushState({}, '', newUrl);
  };

  const handleDataFilter = () => {
    // If no filters are selected, reset to original data
    if (Object.values(selectedFilters).every(selected => !selected?.length)) {
      setFilteredData(quickstartData);
      return;
    }

    const filteredGuides = quickstartData.filter((guide) => {
      return Object.entries(selectedFilters).every(([filterKey, selected]) => {
        if (!selected?.length) return true;
        
        const config = FILTER_CONFIGS[filterKey];
        const guideValue = guide?.data?.[config.frontMatterKey];
        
        if (config.isArray) {
          return selected.some(item => guideValue?.includes(item.value));
        }
        return selected.some(item => guideValue === item.value);
      });
    });
    setFilteredData(filteredGuides);
  };

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filtersFromUrl = {};
    
    // Only add filters that actually exist in the URL
    Object.keys(FILTER_CONFIGS).forEach(filterKey => {
      const config = FILTER_CONFIGS[filterKey];
      const paramValue = params.get(config.urlParam);
      if (paramValue) {
        filtersFromUrl[filterKey] = paramValue.split(',').map(value => ({ 
          value, 
          label: value 
        }));
      }
    });
    
    setSelectedFilters(filtersFromUrl);
  }, [location.search]);

  useEffect(() => {
    updateUrlParams(selectedFilters);
  }, [selectedFilters]);

  // Separating out useEffects because we want to run handleDataFilter after the URL params are set
  // Also just good practice to separate out side effects with different functions
  useEffect(() => {
    handleDataFilter();
  }, [selectedFilters]);

  // Function to organize guides by section
  const organizedGuides = useMemo(() => {
    // Check if any filters are actually selected (not just initialized)
    const hasActiveFilters = Object.values(selectedFilters)
      .some(selected => selected && selected.length > 0);

    if (hasActiveFilters) {
      return {
        filtered: filteredData
      };
    }

    // When no filters are active, use the original quickstartData instead of filteredData
    return CONFIG?.categories?.reduce((acc, category) => {
      return {
        ...acc,
        [normalizeTitle(category.title)]: quickstartData.filter(guide => 
          category.guides?.includes(guide.data.id)
        )
      };
    }, {}) || {};
  }, [filteredData, selectedFilters, quickstartData]);

  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <meta 
          property="og:description" 
          content={description} 
        />
      </Head>
      <Hero
        heading={title}
        subheading={description}
        showGraphic={false}
        customStyles={{ marginBottom: 0 }}
        classNames={styles.quickstartHero}
        lightBackground={true}
      />
      <section id='quickstart-card-section' className={styles.quickstartCardSection}>
        <div className={`container ${styles.quickstartFilterContainer} `}>
          <h3>Filter by</h3>
          {Object.entries(FILTER_CONFIGS).map(([key, config]) => (
            filterOptions[key]?.length > 0 && (
              <CheckboxGroup
                key={key}
                options={filterOptions[key]}
                selectedValues={selectedFilters[key] || []}
                onChange={(selected) => setSelectedFilters(prev => ({
                  ...prev,
                  [key]: selected
                }))}
                label={config.label}
              />
            )
          ))}
          <button 
            className={styles.clearAllFiltersButton}
            onClick={() => {
              setSelectedFilters({});
              setFilteredData(quickstartData); // Reset filteredData to original data
            }}
          >
            Clear all
          </button>
        </div>
        <div>
          {filteredData && filteredData.length > 0 ? (
            <>
              {Object.values(selectedFilters).every(selected => !selected?.length) ? (
                // Show categorized view when no filters are selected
                <>
                  {CONFIG?.categories?.map((category) => (
                    <GuideSection
                      key={normalizeTitle(category.title)}
                      title={category.title}
                      guides={organizedGuides[normalizeTitle(category.title)]}
                    />
                  ))}
                </>
              ) : (
                // Show filtered results without sections when filters are applied
                <div className={styles.quickstartCardContainer}>
                  {filteredData.map((guide) => (
                    <QuickstartGuideCard frontMatter={guide.data} key={guide.data.id || guide.index} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>No quickstarts are available with the selected filters.</p>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default QuickstartList;
