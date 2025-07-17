# Running the API Documentation Portal

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will:
   - Start the Vite development server (typically on port 5173)
   - Start the Express server for Markdown rendering (on port 3001)
   - Both servers run concurrently

3. **Access the documentation:**
   - Open your browser to `http://localhost:5173`
   - Click on any Markdown documentation links in the OpenAPI spec
   - The Express server will render the Markdown files as HTML on-the-fly

## Deployment to GitHub Pages

1. **Build the project:**
   ```bash
   npm run build
   ```
   This will:
   - Run the `convert-markdown.js` script to convert all Markdown files to HTML
   - Build the Vite application
   - Output everything to the `dist` directory

2. **Deploy to GitHub Pages:**

   **Option 1: Using GitHub Actions (recommended)**
   
   Create a file `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3
           
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
             branch: gh-pages
   ```

   **Option 2: Manual deployment**
   ```bash
   # Install gh-pages package if not already installed
   npm install --save-dev gh-pages
   
   # Add deploy script to package.json
   # "deploy": "gh-pages -d dist"
   
   # Deploy
   npm run deploy
   ```

3. **Configure GitHub Pages:**
   - Go to your GitHub repository
   - Navigate to Settings > Pages
   - Set the source to the `gh-pages` branch
   - Save the settings

4. **Access your deployed documentation:**
   - Your site will be available at `https://[username].github.io/[repository-name]/`
   - All Markdown links will now load the pre-rendered HTML files

## How It Works

### During Development
- The Express server intercepts requests for `.md` files
- It renders them as HTML on-the-fly
- Your relative links work as-is

### During Build/Deployment
- The `prebuild` script converts all Markdown files to HTML
- The HTML files have the same name but with `.html` extension
- When deployed, browsers will automatically find the HTML files when clicking on `.md` links

## Troubleshooting

- **Markdown not rendering locally:** Make sure both servers are running. Check the console for any errors.
- **Links not working in production:** Verify that the `convert-markdown.js` script ran successfully during build.
- **Base URL issues:** If your site is deployed to a subdirectory, update the Vite config:
  ```js
  // vite.config.js
  export default {
    base: '/your-repo-name/'
  }
  ```

## Additional Notes

- The solution preserves your relative links in the OpenAPI spec
- No client-side JavaScript is needed for rendering Markdown
- The approach works both locally and when deployed
- All styling is contained within each HTML file for portability