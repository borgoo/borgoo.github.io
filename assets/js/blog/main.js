const POSTS_PER_PAGE = 10;

class BlogHomepage {
  constructor() {
    this.postsContainer = document.getElementById('posts-container');
    this.allPosts = [];
    this.displayedPosts = 0;
    this.postsPerPage = POSTS_PER_PAGE;
    this.loadPosts();
  }

  async loadPosts() {
    try {
      const response = await fetch('data/DB_posts.js');
      if (!response.ok) {
        throw new Error('Failed to load posts');
      }
      
      let posts = await response.json();

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      posts = posts.filter(post => {
        const postDate = new Date(post.createdDate);
        postDate.setHours(0, 0, 0, 0);
        return postDate <= today;
      });
      
      posts.sort((a, b) => {
        const dateA = new Date(a.updatedDate || a.createdDate);
        const dateB = new Date(b.updatedDate || b.createdDate);
        return dateB - dateA;
      });
      
      this.allPosts = posts;
      this.renderPosts();
    } catch (error) {
      this.renderError(error.message);
    }
  }

  renderPosts() {
    if (this.allPosts.length === 0) {
      this.postsContainer.innerHTML = '<p class="loading">No posts available yet.</p>';
      return;
    }

    const postsToShow = this.allPosts.slice(0, this.displayedPosts + this.postsPerPage);
    this.displayedPosts = postsToShow.length;

    const postsHTML = postsToShow.map((post, index) => 
      this.createPostPreview(post, index === 0)
    ).join('');

    const hasMorePosts = this.displayedPosts < this.allPosts.length;
    const loadMoreButton = hasMorePosts ? `
      <div class="load-more">
        <button id="load-more-btn" class="load-more__button">Load more</button>
      </div>
    ` : '';

    this.postsContainer.innerHTML = postsHTML + loadMoreButton;

    if (hasMorePosts) {
      const loadMoreBtn = document.getElementById('load-more-btn');
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => this.renderPosts());
      }
    }
  }

  createPostPreview(post) {
    const createdDate = this.formatDate(post.createdDate);
    const createdRelative = this.getRelativeTime(post.createdDate);
    const updatedDate = post.updatedDate == null ?  this.formatDate(post.createdDate) : this.formatDate(post.updatedDate);
    const updatedRelative = post.updatedDate ? this.getRelativeTime(post.updatedDate) : null;
    const showUpdated = post.createdDate !== post.updatedDate;

    return `
      <article class="posts__item">
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
        <h2 class="post__title">
          <a href="post.html?id=${post.id}" class="post__title">
            ${this.escapeHtml(post.title)}
          </a>
        </h2>
        <p class="post__subtitle">${this.escapeHtml(post.subtitle)}</p>
        <p class="post__abstract">${this.escapeHtml(post.abstract)}</p>
        <a href="post.html?id=${post.id}" class="read-more">Read more</a>
      </article>
    `;
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
    this.postsContainer.innerHTML = `
      <div class="error">
        <p>Error loading posts: ${this.escapeHtml(message)}</p>
      </div>
    `;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new BlogHomepage();
});

