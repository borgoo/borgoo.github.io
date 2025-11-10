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

    this.updateMetaTags(post);

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
            <span>${this.escapeHtml(post.authorNickname)}</span>
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

    if (window.SimpleSlider && typeof window.SimpleSlider.initAll === 'function') {
      window.SimpleSlider.initAll(this.postContainer);
    }
  }

  updateMetaTags(post) {
    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/post.html?id=${post.id}`;
    const fullTitle = `${post.title} - alessandro's blog`;

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
    
    this.addStructuredData(post);
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

  addStructuredData(post) {

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.abstract || `${post.title} - Read this article on alessandro's blog`,
      "author": {
        "@type": "Person",
        "name": "Alessandro Borgonovo",
        "jobTitle": "Software Engineer",
        "url": "https://borgoo.github.io/",
        "sameAs": [
          "https://github.com/borgoo",
          "https://linkedin.com/in/alessandro-borgonovo-9754161b6"
        ]
      },
      "publisher": {
        "@type": "Person",
        "name": "Alessandro Borgonovo"
      },
      "datePublished": post.createdDate,
      "dateModified": post.updatedDate || post.createdDate,
      "url": `https://borgoo.github.io/blog/post.html?id=${post.id}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://borgoo.github.io/blog/post.html?id=${post.id}`
      },
      "inLanguage": "en",
      "isPartOf": {
        "@type": "Blog",
        "name": "alessandro's blog",
        "url": "https://borgoo.github.io/blog/"
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
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