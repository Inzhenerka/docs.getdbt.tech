import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  getCommonProperties,
  generateBlogPostingSchema,
  generateHowToSchema,
} from "./schemaGenerators";

export default function StructuredData({
  type = "BlogPosting",
  title,
  description,
  authors,
  date,
  url,
  imageUrl,
  tags,
  totalTime,
}) {
  const { siteConfig } = useDocusaurusContext();

  // Get common properties shared across all schema types
  const commonProperties = getCommonProperties({
    title,
    description,
    url,
    tags,
    siteConfig,
  });

  // Generate schema based on type
  let jsonLd;

  if (type === "BlogPosting") {
    jsonLd = generateBlogPostingSchema({
      title,
      authors,
      date,
      imageUrl,
      commonProperties,
    });
  } else if (type === "HowTo") {
    jsonLd = generateHowToSchema({
      date,
      totalTime,
      commonProperties,
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
