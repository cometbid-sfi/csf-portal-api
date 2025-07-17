// convert-markdown.js
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import MarkdownIt from "markdown-it";
import shiki from "shiki";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertMarkdownFiles() {
  console.log("Converting Markdown files to HTML...");

  // Check if docs directory exists
  if (!fs.existsSync("public/specs/docs")) {
    console.warn(
      "Warning: public/specs/docs directory not found. Creating it..."
    );
    fs.mkdirpSync("public/specs/docs");
    console.log("Created empty directory. No Markdown files to process.");
    return; // Exit if no docs directory exists
  }

  // Initialize markdown-it with syntax highlighting and plugins
  const highlighter = await shiki.getHighlighter({
    theme: "github-light",
  });

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, { lang });
    },
  });

  // Find all markdown files in the docs directory
  const markdownFiles = glob.sync("public/specs/docs/**/*.md");
  console.log(`Found ${markdownFiles.length} Markdown files`);

  // Process each file
  for (const file of markdownFiles) {
    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(file, "utf8");

    // Add emoji to headings for better visual hierarchy
    // Add these additional replacements to the enhancedContent section
    const enhancedContent = content
      .replace(/^# (.*)/gm, "# 📄 $1")
      .replace(/^## (.*)/gm, "## 📌 $1")
      .replace(/^### (.*)/gm, "### 🔹 $1")
      .replace(/\*\*Features:\*\*/g, "**✨ Features:**")
      .replace(/\*\*Security:\*\*/g, "**🔒 Security:**")
      .replace(/\*\*Usage Examples:\*\*/g, "**🔍 Usage Examples:**")
      .replace(/\*\*Reference:\*\*/g, "**📚 Reference:**")
      // Add these new replacements
      .replace(/\*\*Flow:\*\*/g, "**🔄 Flow:**")
      .replace(/\*\*Rate Limiting:\*\*/g, "**⏱️ Rate Limiting:**")
      .replace(/\*\*Idempotency:\*\*/g, "**🔁 Idempotency:**")
      .replace(/\*\*Security Validations:\*\*/g, "**🛡️ Security Validations:**")
      .replace(/```bash/g, "```bash\n// Example command")
      .replace(/```json/g, "```json\n// Example response");

    const htmlContent = md.render(enhancedContent);

    // Create HTML wrapper with matching style to index.html
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${path.basename(file, ".md")} - API Documentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --banner-bg: #3A7BC8;
      --banner-text: #ffffff;
      --main-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --code-font: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      --text-color: #333333;
      --link-color: #0366d6;
      --border-color: #e1e4e8;
      --code-bg: #f6f8fa;
      --blockquote-color: #6a737d;
      --section-bg: #f8f9fa;
      --callout-bg: #e8f4fd;
      --callout-border: #79b8ff;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--main-font);
      line-height: 1.6;
      color: var(--text-color);
      margin: 0;
      padding: 0;
      font-size: 16px;
    }
    
    /* Sticky header */
    .top-banner {
      background-color: var(--banner-bg);
      color: var(--banner-text);
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .logo-link {
      display: flex;
      align-items: center;
      color: white;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    
    .logo-link:hover {
      opacity: 0.9;
      text-decoration: none;
    }
    
    .banner-left {
      display: flex;
      align-items: center;
    }
    
    .logo-placeholder {
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 20px;
    }
    
    .top-banner h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    
    .back-to-docs {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-family: var(--main-font);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    
    .back-to-docs:hover {
      background-color: rgba(255, 255, 255, 0.3);
      text-decoration: none;
    }
    
    /* Content container */
    .content-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    
    /* Typography */
    .markdown-body {
      font-size: 16px;
    }
    
    .markdown-body h1 {
      font-size: 2.2em;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.3em;
      margin-top: 1.5em;
      margin-bottom: 0.8em;
    }
    
    .markdown-body h2 {
      font-size: 1.8em;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.3em;
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      background-color: var(--section-bg);
      padding: 8px 16px;
      border-radius: 6px;
    }
    
    .markdown-body h3 {
      font-size: 1.4em;
      margin-top: 1.3em;
      margin-bottom: 0.6em;
    }
    
    .markdown-body h4 {
      font-size: 1.2em;
      margin-top: 1.3em;
      margin-bottom: 0.6em;
    }
    
    .markdown-body p, .markdown-body ul, .markdown-body ol {
      margin-bottom: 1.2em;
      font-size: 16px;
    }
    
    /* Code blocks */
    .markdown-body pre {
      background-color: var(--code-bg);
      border-radius: 8px;
      padding: 16px;
      overflow: auto;
      margin: 1.2em 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .markdown-body code {
      font-family: var(--code-font);
      font-size: 90%;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      background-color: var(--code-bg);
    }
    
    .markdown-body pre code {
      padding: 0;
      background-color: transparent;
    }
    
    /* Links */
    .markdown-body a {
      color: var(--link-color);
      text-decoration: none;
    }
    
    .markdown-body a:hover {
      text-decoration: underline;
    }
    
    /* Tables */
    .markdown-body table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1.5em;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .markdown-body table th {
      background-color: var(--section-bg);
      font-weight: 600;
    }
    
    .markdown-body table th, .markdown-body table td {
      padding: 10px 16px;
      border: 1px solid var(--border-color);
    }
    
    .markdown-body table tr:nth-child(2n) {
      background-color: var(--code-bg);
    }
    
    /* Images */
    .markdown-body img {
      max-width: 100%;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    /* Blockquotes */
    .markdown-body blockquote {
      padding: 0.8em 1em;
      color: var(--blockquote-color);
      border-left: 0.25em solid var(--callout-border);
      background-color: var(--callout-bg);
      margin: 1.2em 0;
      border-radius: 0 6px 6px 0;
    }
    
    .markdown-body blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* Lists */
    .markdown-body ul, .markdown-body ol {
      padding-left: 2em;
    }
    
    .markdown-body li {
      margin-bottom: 0.5em;
    }
    
    /* Feature sections */
    .markdown-body strong:contains("✨ Features:"),
    .markdown-body strong:contains("🔒 Security:"),
    .markdown-body strong:contains("🔍 Usage Examples:"),
    .markdown-body strong:contains("📚 Reference:") {
      display: block;
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      font-size: 1.1em;
    }
    
    /* Callout boxes */
    .markdown-body p:has(strong:first-child) {
      background-color: var(--callout-bg);
      border-left: 4px solid var(--callout-border);
      padding: 12px 16px;
      border-radius: 0 6px 6px 0;
      margin: 1.2em 0;
    }
  </style>
</head>
<body>
  <!-- Sticky header that matches the main page -->
  <div class="top-banner">
    <div class="banner-left">
      <a href="/" class="logo-link">
        <div class="logo-placeholder">TCT</div>
        <h1>TCT Foundation API Documentation</h1>
      </a>
    </div>
    <a href="/csf-portal-api/" class="back-to-docs">Back to API Explorer</a>
  </div>
  
  <div class="content-container">
    <div class="markdown-body">
      ${htmlContent}
    </div>
  </div>
  
  <script>
    // Add copy button to code blocks
    document.querySelectorAll('pre').forEach(block => {
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = 'Copy';
      button.style.position = 'absolute';
      button.style.top = '5px';
      button.style.right = '5px';
      button.style.padding = '4px 8px';
      button.style.fontSize = '12px';
      button.style.fontFamily = 'var(--main-font)';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.backgroundColor = 'rgba(0,0,0,0.1)';
      button.style.cursor = 'pointer';
      
      block.style.position = 'relative';
      
      button.addEventListener('click', () => {
        const code = block.querySelector('code').innerText;
        navigator.clipboard.writeText(code);
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
      
      block.appendChild(button);
    });
  </script>
</body>
</html>
    `;

    // Write HTML file with the same name but .html extension
    const htmlFile = file.replace(".md", ".html");
    fs.outputFileSync(htmlFile, fullHtml);
    console.log(`Converted ${file} to ${htmlFile}`);
  }

  console.log("Markdown conversion complete!");
}

// Run the conversion
convertMarkdownFiles().catch((err) => {
  console.error("Error converting Markdown files:", err);
  process.exit(1);
});
