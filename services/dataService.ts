import { BlogPost } from '../types';

// Cache to store loaded posts to avoid re-fetching
let postsCache: BlogPost[] | null = null;

export const dataService = {
  // Fetch the index (manifest) of all posts
  getAllPosts: async (): Promise<BlogPost[]> => {
    if (postsCache) return postsCache;

    try {
      const response = await fetch('/posts/index.json');
      if (!response.ok) throw new Error('Failed to fetch posts index');
      const posts: BlogPost[] = await response.json();
      postsCache = posts;
      return posts;
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  },

  // Fetch a specific post by its slug (Custom URL)
  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    const posts = await dataService.getAllPosts();
    const post = posts.find(p => p.slug === slug);

    if (!post || !post.source) return undefined;

    // If we haven't loaded the content yet, fetch the markdown file
    if (!post.content) {
      try {
        const response = await fetch(`/posts/${post.source}`);
        if (response.ok) {
          post.content = await response.text();
        } else {
          post.content = "Error loading content.";
        }
      } catch (error) {
        console.error(`Error loading markdown for ${slug}:`, error);
        post.content = "Error loading content.";
      }
    }

    return post;
  },

  // Full text search
  searchPosts: async (query: string): Promise<BlogPost[]> => {
    const posts = await dataService.getAllPosts();
    if (!query.trim()) return [];

    // To search content, we might need to load it. 
    // For a lightweight blog, we can pre-load all content or just search summaries/titles.
    // Here we search summaries and titles immediately. 
    // If you want full-content search, you'd need to fetch all MD files (trade-off: network usage).
    
    const lowerQuery = query.toLowerCase();
    
    // Simple search on metadata first
    return posts.filter(post => {
      const inTitle = post.title.toLowerCase().includes(lowerQuery);
      const inSummary = post.summary.toLowerCase().includes(lowerQuery);
      return inTitle || inSummary;
    });
  }
};