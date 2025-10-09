# How to

## 🚀 Publish a new post

This checklist ensures SEO optimization for every new blog post published on [alessandro's blog](https://borgoo.github.io/blog/).

### 1. 📝 Update Blog Data (Required)

**File:** `blog/data/DB_posts.js`

```javascript
{
  "id": "your-post-slug",
  "contentFile": "posts/your-post-file.html",
  "title": "Your Post Title",
  "subtitle": "Optional subtitle",
  "abstract": "Compelling 150-160 character description for search engines",
  "author": "Alessandro Borgonovo",
  "authorNickname": "@boborgo",
  "createdDate": "YYYY-MM-DD",
  "updatedDate": "YYYY-MM-DD"
}
```

**✅ Checklist:**
- [ ] Add new post entry to `DB_posts.js`
- [ ] Ensure `abstract` is 150-160 characters
- [ ] Use descriptive, keyword-rich `title`
- [ ] Set proper `createdDate` and `updatedDate`
- [ ] Use lowercase, hyphenated `id`

### 2. 🗺️ Update Sitemap (Required)

**File:** `blog/sitemap.xml`

```xml
<url>
  <loc>https://borgoo.github.io/blog/post.html?id=your-post-slug</loc>
  <lastmod>YYYY-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**✅ Checklist:**
- [ ] Add new post URL to `blog/sitemap.xml`
- [ ] Update `lastmod` date to current date
- [ ] Set appropriate `changefreq` (usually "monthly" for blog posts)
- [ ] Use priority 0.8 for individual posts

### 3. ⏳ Wait for Natural Discovery

Search engines will automatically discover and index your new post within 1-7 days through the sitemap.

## 📋 Quick Reference Commands

### Test SEO
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
- **PageSpeed Insights:** https://pagespeed.web.dev/

### Submit to Search Engines (Optional - to speed up the process)
- **Google Search Console:** https://search.google.com/search-console
- **Bing Webmaster Tools:** https://www.bing.com/webmasters

## 📚 Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Blog SEO Best Practices](https://blog.hubspot.com/marketing/blog-seo)