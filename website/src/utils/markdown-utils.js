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

    // Try to get metadata from useDoc hook (most reliable method)
    try {
      const { metadata } = useDoc();

      // metadata.source contains the actual source file path
      // It can be in different formats, so try multiple approaches
      if (metadata?.source) {
        // Try direct match first
        if (rawMarkdownData[metadata.source]) {
          return removeFrontmatter(rawMarkdownData[metadata.source]);
        }

        // Try removing @site/ prefix if present
        const sourceWithoutSite = metadata.source.replace(/^@site\//, '');
        if (rawMarkdownData[sourceWithoutSite]) {
          return removeFrontmatter(rawMarkdownData[sourceWithoutSite]);
        }

        // Try adding docs/ prefix if not present
        if (!sourceWithoutSite.startsWith('docs/')) {
          const sourceWithDocs = `docs/${sourceWithoutSite}`;
          if (rawMarkdownData[sourceWithDocs]) {
            return removeFrontmatter(rawMarkdownData[sourceWithDocs]);
          }
        }

        console.debug('metadata.source found but not in rawMarkdownData:', metadata.source);
        console.debug('Available keys sample:', Object.keys(rawMarkdownData).slice(0, 5));
      }
    } catch (docError) {
      // useDoc() might not be available on all pages, fall back to path matching
      console.debug('useDoc not available, falling back to path matching:', docError.message);
    }

    // Fallback: Try direct path matching as backup
    // Strip query parameters and hash from the pathname
    const currentPath = window.location.pathname;
    const urlParts = currentPath.split('/').filter(part => part.length > 0);

    // Build potential file paths
    const potentialPaths = [];
    const lastPart = urlParts[urlParts.length - 1];
    const basePath = urlParts.join('/');

    // Direct path match (the URL path should match the file path)
    potentialPaths.push(`${basePath}.md`);

    // Known content directories in the docs folder
    const knownContentDirs = ['docs', 'guides', 'reference', 'best-practices', 'community',
                               'faqs', 'release-notes', 'sql-reference', 'terms'];

    // For paths not starting with known content directories, try adding docs/ prefix
    if (urlParts[0] && !knownContentDirs.includes(urlParts[0])) {
      potentialPaths.push(`docs/${basePath}.md`);
    }

    // Try with common prefixes on the last part (like 'apis-', 'schema-', 'sl-')
    if (urlParts.length > 0) {
      const commonPrefixes = ['apis-', 'schema-', 'sl-'];
      for (const prefix of commonPrefixes) {
        const pathWithPrefix = [...urlParts.slice(0, -1), `${prefix}${lastPart}`].join('/');
        potentialPaths.push(`${pathWithPrefix}.md`);
      }
    }

    // Try with -qs suffix (common pattern for quickstart guides)
    if (urlParts.length > 0) {
      const pathWithQs = [...urlParts.slice(0, -1), `${lastPart}-qs`].join('/');
      potentialPaths.push(`${pathWithQs}.md`);
    }

    // Try with index.md for root or trailing slash paths
    if (basePath === '' || currentPath.endsWith('/')) {
      potentialPaths.push('docs/index.md');
      potentialPaths.push('index.md');
    }

    // Try each potential path
    for (const filePath of potentialPaths) {
      if (rawMarkdownData[filePath]) {
        return removeFrontmatter(rawMarkdownData[filePath]);
      }
    }

    // Debug logging to help identify the issue
    console.debug('Failed to find markdown content for path:', currentPath);
    console.debug('Attempted paths:', potentialPaths);
    console.debug('Available markdown paths sample:', Object.keys(rawMarkdownData).slice(0, 10));

    return null;
  } catch (error) {
    console.warn('Could not access raw markdown data:', error);
    return null;
  }
}
