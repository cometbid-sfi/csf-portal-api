// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";
import hljs from "highlight.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3001;

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
});

// Simple middleware to handle all requests
app.use((req, res, next) => {
  // Only process .md files
  if (!req.path.endsWith(".md")) {
    return next();
  }

  const filePath = path.join(__dirname, req.path);
  console.log(`Attempting to render Markdown file: ${filePath}`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return next();
  }

  // Read and render the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      return next(err);
    }

    // Convert Markdown to HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Documentation</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/github.min.css">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }
          pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
          }
          code {
            font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 85%;
          }
          h1, h2, h3, h4 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
          }
          h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
          h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
          h3 { font-size: 1.25em; }
          h4 { font-size: 1em; }
          a { color: #0366d6; text-decoration: none; }
          a:hover { text-decoration: underline; }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
          }
          table th, table td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
          }
          table tr:nth-child(2n) {
            background-color: #f6f8fa;
          }
          img { max-width: 100%; }
          blockquote {
            padding: 0 1em;
            color: #6a737d;
            border-left: 0.25em solid #dfe2e5;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="markdown-body">
          ${marked.parse(data)}
        </div>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(htmlContent);
    console.log(`Successfully rendered Markdown file: ${req.path}`);
  });
});

// Serve static files AFTER Markdown handler
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(
    `Access Markdown docs at http://localhost:${port}/public/specs/docs/authentication-doc.md`
  );
});
