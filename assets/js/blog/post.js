class BlogPost {
  constructor() {
    this.postContainer = document.getElementById('post-container');
    this.postId = this.getPostIdFromUrl();
    
    if (!this.postId) {
      this.renderError('No post ID provided');
      return;
    }
    
    this.loadPost();
  }

  getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  async loadPost() {
    try {

      const response = await fetch('data/DB_posts.js');
      if (!response.ok) {
        throw new Error('Failed to load posts metadata');
      }
      
      const posts = await response.json();
      const post = posts.find(p => p.id === this.postId);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      const contentResponse = await fetch(post.contentFile);
      if (!contentResponse.ok) {
        throw new Error('Failed to load post content');
      }
      
      const content = await contentResponse.text();
      this.renderPost(post, content);
      
      document.title = `${post.title} - EZ Blog`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.abstract);
      }
    } catch (error) {
      this.renderError(error.message);
    }
  }

  renderPost(post, content) {
    const createdDate = this.formatDate(post.createdDate);
    const createdRelative = this.getRelativeTime(post.createdDate);
    const updatedDate = this.formatDate(post.updatedDate);
    const updatedRelative = this.getRelativeTime(post.updatedDate);
    const showUpdated = post.createdDate !== post.updatedDate;

    // Update page title and meta tags for SEO
    this.updateMetaTags(post);
    
    // Add Schema.org structured data
    this.addStructuredData(post);

    this.postContainer.innerHTML = `
      <header class="post__header">
        <h1>${this.escapeHtml(post.title)}</h1>
        <p class="post__subtitle">${this.escapeHtml(post.subtitle)}</p>
        <div class="post__meta">
          <span class="post__meta-item">
            <time datetime="${post.createdDate}">${createdDate} (${createdRelative})</time>
          </span>
          ${showUpdated ? `
            <span class="post__meta-item">
              <span>Updated: ${updatedDate} (${updatedRelative})</span>
            </span>
          ` : ''}
          <span class="post__meta-item">
            <span>${this.escapeHtml(post.author)}</span>
          </span>
        </div>
      </header>
      <div class="post__content">
        ${content}
      </div>
      <div class="post__footer">
        <a href="index.html" class="go-back"> Go back</a>
      </div>
    `;
  }

  updateMetaTags(post) {
    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/post.html?id=${post.id}`;
    const fullTitle = `${post.title} - EZ Blog`;

    document.title = fullTitle;

    this.setMetaTag('name', 'title', fullTitle);
    this.setMetaTag('name', 'description', post.abstract);
    this.setMetaTag('name', 'author', post.author);

    this.setLinkTag('canonical', postUrl);

    this.setMetaTag('property', 'og:type', 'article');
    this.setMetaTag('property', 'og:url', postUrl);
    this.setMetaTag('property', 'og:title', fullTitle);
    this.setMetaTag('property', 'og:description', post.abstract);
    this.setMetaTag('property', 'article:published_time', post.createdDate);
    this.setMetaTag('property', 'article:modified_time', post.updatedDate);
    this.setMetaTag('property', 'article:author', post.author);

    this.setMetaTag('property', 'twitter:url', postUrl);
    this.setMetaTag('property', 'twitter:title', fullTitle);
    this.setMetaTag('property', 'twitter:description', post.abstract);
  }

  setMetaTag(attribute, key, content) {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  setLinkTag(rel, href) {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  }

  addStructuredData(post) {
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.abstract,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.createdDate,
      "dateModified": post.updatedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${window.location.origin}/post.html?id=${post.id}`
      },
      "publisher": {
        "@type": "Organization",
        "name": "EZ Blog"
      }
    };

    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  renderError(message) {
    this.postContainer.innerHTML = `
      <div class="error">
        <p>Error: ${this.escapeHtml(message)}</p>
        <p><a href="index.html" class="read-more">Return to homepage</a></p>
      </div>
    `;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new BlogPost();
});

