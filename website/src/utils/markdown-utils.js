/**
 * Removes frontmatter from markdown content
 * @param {string} content - The markdown content that may contain frontmatter
 * @returns {string} The content without frontmatter
 */
function removeFrontmatter(content) {
  if (!content) return content;
  
  // Check if content starts with frontmatter (--- on first line)
  const lines = content.split('\n');
  if (lines.length > 0 && lines[0].trim() === '---') {
    // Find the closing ---
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        // Return content after the closing ---
        return lines.slice(i + 1).join('\n').trim();
      }
    }
  }
  
  // No frontmatter found, return original content
  return content;
}

/**
 * Normalize metadata.source to match rawMarkdownData keys
 * @param {string} source - The source path from metadata
 * @returns {string} Normalized path
 */
function normalizeMetadataSource(source) {
  // Remove common prefixes like @site/, @docusaurus/, website/, etc.
  return source
    .replace(/^@site\/website\/docs\//, '')
    .replace(/^@site\/docs\//, '')
    .replace(/^@site\//, '')
    .replace(/^website\/docs\//, '')
    .replace(/^docs\/docs\//, 'docs/') // Handle double docs/ from website/docs/docs/
    .replace(/^\.\.\//, '');
}

/**
 * Generate potential file paths based on URL path
 * Handles cases where the URL doesn't match the filename due to custom frontmatter IDs
 * @param {string} pathname - The URL pathname
 * @returns {Array<string>} Array of potential file paths to try
 */
function generatePotentialPaths(pathname) {
  const urlParts = pathname.split('/').filter(part => part.length > 0);
  const potentialPaths = [];

  if (urlParts.length === 0) {
    return ['docs/index.md', 'index.md'];
  }

  const lastPart = urlParts[urlParts.length - 1];
  const basePath = urlParts.join('/');

  // Strategy 1: Direct match (URL path matches file path)
  potentialPaths.push(`${basePath}.md`);

  // Strategy 2: Try common filename patterns that differ from URL
  // These patterns come from frontmatter "id" fields that create different URLs
  const filenameVariations = [
    `${lastPart}-qs`,      // quickstart guides: /guides/fusion -> fusion-qs.md
    `apis-${lastPart}`,    // API docs: /docs/dbt-cloud-apis/overview -> apis-overview.md
    `schema-${lastPart}`,  // Schema docs
    `sl-${lastPart}`,      // Semantic layer docs
  ];

  for (const variation of filenameVariations) {
    const pathWithVariation = [...urlParts.slice(0, -1), variation].join('/');
    potentialPaths.push(`${pathWithVariation}.md`);
  }

  return potentialPaths;
}

/**
 * Hook to get raw markdown content for the current page
 * Uses Docusaurus metadata for reliable file path resolution
 * @returns {string} The raw markdown content or null if not available
 */
export function useRawMarkdownContent() {
  try {
    const { useDoc } = require('@docusaurus/plugin-content-docs/client');
    const { usePluginData } = require('@docusaurus/useGlobalData');
    const { rawMarkdownData } = usePluginData('docusaurus-build-raw-markdown-data-plugin');

    if (!rawMarkdownData) {
      return null;
    }

    // Strategy 1: Use Docusaurus metadata (most reliable when available)
    try {
      const { metadata } = useDoc();
      if (metadata?.source) {
        const normalizedSource = normalizeMetadataSource(metadata.source);
        if (rawMarkdownData[normalizedSource]) {
          return removeFrontmatter(rawMarkdownData[normalizedSource]);
        }
      }
    } catch (docError) {
      // useDoc() not available on this page type, will use fallback
    }

    // Strategy 2: Fallback to URL-based path matching
    // This handles cases where useDoc() fails or metadata.source doesn't match
    const pathname = window.location.pathname;
    const potentialPaths = generatePotentialPaths(pathname);

    for (const filePath of potentialPaths) {
      if (rawMarkdownData[filePath]) {
        return removeFrontmatter(rawMarkdownData[filePath]);
      }
    }

    // If we still haven't found it, log for debugging
    console.debug('Failed to find markdown content for:', pathname);
    console.debug('Tried paths:', potentialPaths);

    return null;
  } catch (error) {
    console.warn('Could not access raw markdown data:', error);
    return null;
  }
}
