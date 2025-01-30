import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import getIconType from "../../utils/get-icon-type";
import getSvgIcon from "../../utils/get-svg-icon";

export default function QuickstartGuideCard({ frontMatter }) {
  const { id, title, time_to_complete, icon, tags, level, recently_updated } =
    frontMatter;

  const rightArrow = getSvgIcon('fa-arrow-right')

  return (
    <Link to={`/guides/${id}`} className={styles.quickstartCard}>
      {recently_updated && (
        <span className={styles.recently_updated}>Updated</span>
      )}
      {icon && getIconType(icon, styles.icon)}

      <p>{title}</p>

      {time_to_complete && (
        <span className={styles.time_to_complete}>{time_to_complete}</span>
      )}

      <span to={`/guides/${id}`} className={styles.start}>
        Start <span className={styles.right_arrow}>{rightArrow}</span>
      </span>
    </Link>
  );
}

// Component that handles the information under the title on the quickstart guide page
export function QuickstartGuideTitle({ frontMatter }) {
  const { id, time_to_complete, tags, level, recently_updated } = frontMatter;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if this guide is in favorites when component mounts
    const favorites = JSON.parse(localStorage.getItem('favoriteGuides') || '[]');
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteGuides') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav !== id);
      localStorage.setItem('favoriteGuides', JSON.stringify(newFavorites));
    } else {
      favorites.push(id);
      localStorage.setItem('favoriteGuides', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.infoContainer}>
      <div className={styles.leftInfo}>
        <div>
          <button 
            onClick={toggleFavorite}
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            
            {getSvgIcon('fa-star')}
          </button>
        </div>
        {recently_updated && (
          <span className={styles.recently_updated}>Updated</span>
        )}
        {time_to_complete && (
          <span className={styles.time_to_complete}>
            {getSvgIcon('fa-clock')} {time_to_complete}
          </span>
        )}
      </div>

      {(tags || level) && (
        <div className={styles.tag_container}>
          {tags &&
            tags.map((tag, i) => (
              <div className={styles.tag} key={i}>
                {tag}
              </div>
            ))}
          {level && <div className={styles.tag}>{level}</div>}
        </div>
      )}
    </div>
  );
}
