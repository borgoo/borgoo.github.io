# How to

### 1. Create the Post HTML File

**File:** `blog/buildable-drafts/your-post-slug.html`

Create a new HTML file in the `blog/buildable-drafts/` directory. Use a URL-friendly name (lowercase, hyphens instead of spaces).

### 2. Add Post Metadata (Required)

**File:** `blog/buildable-drafts/data/DB_posts.js`

Edit the file and add your post metadata to the array:

```javascript
[
  // ... existing posts
  {
    "id": "your-post-slug",                    // Must match filename without .html
    "contentFile": "your-post-slug.html",      // Path to your HTML file
    "title": "Your Post Title",                 // Main title
    "subtitle": "A subtitle that adds context", // Subtitle (optional)
    "abstract": "Compelling 150-160 character description for search engines",
    "author": "Alessandro Borgonovo",
    "authorNickname": "@boborgo",
    "createdDate": "YYYY-MM-DD",               // Format: YYYY-MM-DD
    "updatedDate": "YYYY-MM-DD",               // Format: YYYY-MM-DD
    "language": "en"                            // Language code
  }
]
```

**Important Notes:**
- The `id` should be URL-friendly (lowercase, hyphens instead of spaces)
- The `id` must match the filename (without `.html`)
- Posts with `createdDate` in the future will not be published until that date
- Posts are automatically sorted by `updatedDate` (or `createdDate`) in descending order

### 3. Build the Blog

Navigate to the `blog/` directory and run the build script:

```bash
cd blog
node build.js
```

This will:
- Copy assets from `buildable-drafts/assets/` to `posts/assets/`
- Copy data from `buildable-drafts/data/` to `posts/data/`
- Generate `index.html` with all posts
- Generate individual post pages in `posts/`
- **Automatically generate `robots.txt` and `sitemap.xml`** (no manual update needed!)

**Quick Test (Index Only):**
To generate only the `index.html` file for quick testing:
```bash
node build.js --index-only
# or
node build.js -i
```


### 4. Deploy

After building, commit and push the generated files to GitHub:

```bash
git add blog/index.html blog/posts/ blog/sitemap.xml blog/robots.txt
git commit -m "feat: add new post: your-post-title"
git push
```

**Note:** The `buildable-drafts/` directory is excluded from version control (via `.gitignore`) to keep your drafts private. Drafts are version controlled in a separate repository.