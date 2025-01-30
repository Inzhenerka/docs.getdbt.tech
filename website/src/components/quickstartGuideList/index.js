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

function QuickstartList({ quickstartData }) {
  const { siteConfig } = useDocusaurusContext();
  
  const title = CONFIG?.title;
  const description = CONFIG?.description;
  
  const metaTitle = `${title}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`;

  const [filteredData, setFilteredData] = useState(() => quickstartData);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();

  // UseMemo to prevent re-rendering on every filter change
  // Get tag options
  // Populated from the tags frontmatter array
  const tagOptions = useMemo(() => {
    const tags = new Set();
    quickstartData.forEach(guide =>
      guide?.data?.tags?.forEach(tag => tags.add(tag))
    );
    // Sort alphabetically
    return Array.from(tags).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map(tag => ({ value: tag, label: tag }));
  }, [quickstartData]);

  // Get level options
  // Populated by the level frontmatter string
  const levelOptions = useMemo(() => {
    const levels = new Set();
    quickstartData.forEach(guide =>
      guide?.data?.level && levels.add(guide.data.level)
    );
    return Array.from(levels).map(level => ({ value: level, label: level }));
  }, [quickstartData]);

  const updateUrlParams = (selectedTags, selectedLevel) => {
    // Create a new URLSearchParams object from the current URL search string
    const params = new URLSearchParams(location.search);

    // Remove existing 'tags' and 'level' parameters
    params.delete('tags');
    params.delete('level');

    // Join multiple tags and levels with commas
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.map(tag => tag.value).join(','));
    }
    if (selectedLevel.length > 0) {
      params.set('level', selectedLevel.map(level => level.value).join(','));
    }

    // Construct the new URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;

    // Update the URL without causing a page reload or scroll
    window.history.pushState({}, '', newUrl);
  };

  // Handle all filters
  const handleDataFilter = () => {
    const filteredGuides = quickstartData.filter((guide) => {
      const tagsMatch = selectedTags.length === 0 || (Array.isArray(guide?.data?.tags) && selectedTags.some((tag) =>
        guide?.data?.tags.includes(tag.value)
      ));
      const levelMatch = selectedLevel.length === 0 || (guide?.data?.level && selectedLevel.some((level) =>
        guide?.data?.level === level.value
      ));
      const titleMatch = searchInput === '' || guide?.data?.title?.toLowerCase().includes(searchInput.toLowerCase());
      return tagsMatch && levelMatch && titleMatch;
    });
    setFilteredData(filteredGuides);
  };

  // Reads the current URL params applied and sets the selected tags and levels
  // This allows the filters to be sharable via URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagsFromUrl = params.get('tags')
      ? params.get('tags').split(',').map(tag => ({ value: tag, label: tag }))
      : [];
    const levelsFromUrl = params.get('level')
      ? params.get('level').split(',').map(level => ({ value: level, label: level }))
      : [];
    setSelectedTags(tagsFromUrl);
    setSelectedLevel(levelsFromUrl);
  }, [location.search]);

  useEffect(() => {
    updateUrlParams(selectedTags, selectedLevel);
  }, [selectedTags, selectedLevel]);

  // Separating out useEffects because we want to run handleDataFilter after the URL params are set
  // Also just good practice to separate out side effects with different functions
  useEffect(() => {
    handleDataFilter();
  }, [selectedTags, selectedLevel, searchInput]); // Added searchInput to dependency array

  // Function to organize guides by section
  const organizedGuides = useMemo(() => {
    if (selectedTags.length > 0 || selectedLevel.length > 0 || searchInput) {
      return {
        filtered: filteredData
      };
    }

    // Create an object with keys for each category
    return CONFIG?.categories?.reduce((acc, category) => {
      return {
        ...acc,
        [normalizeTitle(category.title)]: filteredData.filter(guide => 
          category.guides?.includes(guide.data.id)
        )
      };
    }, {}) || {};
  }, [filteredData, selectedTags, selectedLevel, searchInput]);

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
          {tagOptions && tagOptions.length > 0 && (
            <CheckboxGroup
              options={tagOptions}
              selectedValues={selectedTags}
              onChange={setSelectedTags}
              label="Choose a topic"
            />
          )}
          {levelOptions && levelOptions.length > 0 && (
            <CheckboxGroup
              options={levelOptions}
              selectedValues={selectedLevel}
              onChange={setSelectedLevel}
              label="Choose a topic"
            />
          )}
          <button 
            className={styles.clearAllFiltersButton}
            onClick={() => {
              setSelectedTags([]);
              setSelectedLevel([]);
            }}
          >
            Clear all
          </button>
        </div>
        <div>
          {filteredData && filteredData.length > 0 ? (
            <>
              {!selectedTags.length && !selectedLevel.length && !searchInput ? (
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
