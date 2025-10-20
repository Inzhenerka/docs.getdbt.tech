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
 * Uses the pathByIdMap from the plugin to resolve custom frontmatter IDs
 * @returns {string} The raw markdown content or null if not available
 */
export function useRawMarkdownContent() {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null;
    }

    const { usePluginData } = require('@docusaurus/useGlobalData');
    const pluginData = usePluginData('docusaurus-build-raw-markdown-data-plugin');
    const { rawMarkdownData, pathByIdMap } = pluginData || {};

    if (!rawMarkdownData) {
      return null;
    }

    // Get the current URL pathname (query parameters are automatically excluded)
    const pathname = window.location.pathname;
    const urlPath = pathname.split('/').filter(part => part.length > 0).join('/');

    // Try to find the markdown content using multiple strategies
    const potentialPaths = [
      // Strategy 1: Direct path match (URL matches filename)
      `${urlPath}.md`,
      `${urlPath}.mdx`,

      // Strategy 2: Use the ID mapping (handles custom frontmatter IDs)
      // This is the key to solving the problem - the plugin pre-computed this for us!
      pathByIdMap?.[`${urlPath}.md`],
      pathByIdMap?.[`${urlPath}.mdx`],
    ].filter(Boolean); // Remove null/undefined entries

    // Try each potential path
    for (const filePath of potentialPaths) {
      if (rawMarkdownData[filePath]) {
        return removeFrontmatter(rawMarkdownData[filePath]);
      }
    }

    return null;
  } catch (error) {
    console.warn('Could not access raw markdown data:', error);
    return null;
  }
}
