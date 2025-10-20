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
 * @returns {string} The raw markdown content or null if not available
 */
export function useRawMarkdownContent() {
  try {
    const { usePluginData } = require('@docusaurus/useGlobalData');
    const { rawMarkdownData } = usePluginData('docusaurus-build-raw-markdown-data-plugin');
    
    if (!rawMarkdownData) {
      return null;
    }
    
    // Get the current page path
    const currentPath = window.location.pathname;
    
    // Extract the key parts from the URL to build search terms
    const urlParts = currentPath.split('/').filter(part => part.length > 0);
    
    // Try exact path matching first
    let filePath = currentPath.replace(/^\//, '');
    if (filePath === '') {
      filePath = 'index.md';
    } else if (filePath.startsWith('docs/')) {
      filePath = filePath.replace(/\/$/, '') + '.md';
    } else {
      filePath = 'docs/' + filePath.replace(/\/$/, '') + '.md';
    }
    
    if (rawMarkdownData[filePath]) {
      return removeFrontmatter(rawMarkdownData[filePath]);
    }
    
    // Try alternative exact paths
    const exactPaths = [];
    
    // Try without docs/ prefix
    if (filePath.startsWith('docs/')) {
      exactPaths.push(filePath.replace('docs/', ''));
    }
    
    // Try with docs/ prefix if it doesn't have it
    if (!filePath.startsWith('docs/')) {
      exactPaths.push('docs/' + filePath);
    }
    
    // Try each exact path
    for (const exactPath of exactPaths) {
      if (rawMarkdownData[exactPath]) {
        return removeFrontmatter(rawMarkdownData[exactPath]);
      }
    }
    
    // If no exact match, try smart partial matching
    const searchTerms = urlParts.map(part => part.replace(/[-_]/g, ''));
    const lastUrlPart = urlParts[urlParts.length - 1];
    
    const matchingPaths = Object.keys(rawMarkdownData).filter(path => {
      const pathLower = path.toLowerCase();
      // Must contain the last URL part (filename)
      if (!pathLower.includes(lastUrlPart.toLowerCase())) {
        return false;
      }
      // And must contain at least one other search term
      return searchTerms.some(term => 
        pathLower.includes(term.toLowerCase())
      );
    });
    
    if (matchingPaths.length > 0) {
      // Sort by relevance (paths with more matching terms first)
      const sortedPaths = matchingPaths.sort((a, b) => {
        const aMatches = searchTerms.filter(term => 
          a.toLowerCase().includes(term.toLowerCase())
        ).length;
        const bMatches = searchTerms.filter(term => 
          b.toLowerCase().includes(term.toLowerCase())
        ).length;
        return bMatches - aMatches;
      });
      
      return removeFrontmatter(rawMarkdownData[sortedPaths[0]]);
    }
    
    return null;
  } catch (error) {
    console.warn('Could not access raw markdown data:', error);
    return null;
  }
}
