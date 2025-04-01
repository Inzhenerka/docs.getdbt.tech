import React from "react";

export default function StructuredData({
  title,
  description,
  authors,
  date,
  url,
  imageUrl,
  tags,
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    author:
      authors?.map((author) => ({
        "@type": "Person",
        name: author.name,
      })) || [],
    datePublished: date,
    dateModified: date,
    image: imageUrl,
    url: url,
    keywords: tags?.map((tag) => tag.label).join(","),
    publisher: {
      "@type": "Organization",
      name: "dbt Labs",
      logo: {
        "@type": "ImageObject",
        url: "https://www.getdbt.com/ui/img/dbt-logo.png",
      },
    },
  };

  return <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>;
}
