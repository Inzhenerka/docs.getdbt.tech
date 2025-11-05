/**
 * Schema generators for different structured data types
 */

/**
 * Generate common properties shared across all schema types
 */
export function getCommonProperties({ title, description, url, tags, siteConfig }) {
  return {
    "@context": "https://schema.org",
    name: title,
    description: description,
    url: url,
    keywords: tags?.map((tag) => (typeof tag === 'string' ? tag : tag.label)).join(","),
    publisher: {
      "@type": "Organization",
      name: "dbt Labs",
      logo: {
        "@type": "ImageObject",
        url: siteConfig.url + "/img/dbt-logo.svg",
      },
    },
  };
}

/**
 * Generate BlogPosting schema
 */
export function generateBlogPostingSchema({ title, authors, date, imageUrl, commonProperties }) {
  return {
    ...commonProperties,
    "@type": "BlogPosting",
    headline: title,
    author:
      authors?.map((author) => ({
        "@type": "Person",
        name: author.name,
      })) || [],
    datePublished: date,
    dateModified: date,
    image: imageUrl,
  };
}

/**
 * Generate HowTo schema
 */
export function generateHowToSchema({ date, totalTime, commonProperties }) {
  const schema = {
    ...commonProperties,
    "@type": "HowTo",
    author: {
      "@type": "Organization",
      name: "dbt Labs",
    },
  };

  // Add dates if provided
  if (date) {
    schema.datePublished = date;
    schema.dateModified = date;
  }

  // Add totalTime if provided (should be in ISO 8601 duration format, e.g., "PT30M")
  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return schema;
}

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema({ date, commonProperties }) {
  const schema = {
    ...commonProperties,
    "@type": "WebPage",
    author: {
      "@type": "Organization",
      name: "dbt Labs",
    },
  };

  // Add dates if provided
  if (date) {
    schema.datePublished = date;
    schema.dateModified = date;
  }

  return schema;
}
