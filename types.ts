export interface BlogPost {
  id: string;
  slug: string; // Custom URL slug (e.g., 'wealth')
  title: string;
  date: string;
  category: string;
  summary: string;
  source?: string; // The filename of the markdown file (e.g. 'wealth.md')
  content?: string; // Populated after fetching
}

export interface SearchResult {
  post: BlogPost;
  matchType: 'title' | 'content';
}