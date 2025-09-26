const fs = require('fs');
const path = require('path');

module.exports = function buildRawMarkdownDataPlugin() {
  return {
    name: 'docusaurus-build-raw-markdown-data-plugin',
    async loadContent() {
      // Get all markdown files from the docs directory
      const docsDirectory = 'docs';
      const rawMarkdownData = {};

      function scanDirectory(dir, basePath = '') {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            // Recursively scan subdirectories
            scanDirectory(filePath, path.join(basePath, file));
          } else if (file.endsWith('.md')) {
            // Read the raw markdown content
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.join(basePath, file);
            
            // Store the raw content with the relative path as key
            rawMarkdownData[relativePath] = content;
          }
        });
      }

      // Scan the docs directory (which contains the actual markdown files)
      scanDirectory(docsDirectory);
      
      return rawMarkdownData;
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      
      // Make the raw markdown data available globally
      setGlobalData({
        rawMarkdownData: content
      });
    },
  };
}; 
