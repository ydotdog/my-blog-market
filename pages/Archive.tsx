import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { BlogPost } from '../types';
import { dataService } from '../services/dataService';

const Archive: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    dataService.getAllPosts().then(data => {
      // Sort by date descending (newest first) using string comparison
      const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date));
      setPosts(sortedData);
      setFilteredPosts(sortedData);
      setLoading(false);
    });
  }, []);

  // Search Logic
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setFilteredPosts(posts);
        return;
      }
      
      const results = await dataService.searchPosts(query);
      // Sort search results by date descending using string comparison
      const sortedResults = [...results].sort((a, b) => b.date.localeCompare(a.date));
      setFilteredPosts(sortedResults);
    };

    performSearch();
  }, [query, posts]);

  return (
    <div className="space-y-12 animate-fade-in max-w-2xl mx-auto">
      <div className="space-y-4 text-center sm:text-left">
        <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
          归档
        </h1>
      </div>

      {/* Minimalist Search Bar */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-transparent focus-within:border-neutral-100 dark:focus-within:border-neutral-800 transition-colors duration-300">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-300 dark:text-neutral-600 group-focus-within:text-neutral-500 dark:group-focus-within:text-neutral-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="搜索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-8 pr-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 transition-colors font-serif"
          />
        </div>
      </div>

      {/* Results List - Naval Style (Date Left, Title Right) */}
      <div className="space-y-2 min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-neutral-400" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="flex flex-col">
            {filteredPosts.map((post) => (
              <article key={post.id} className="group flex flex-col sm:flex-row sm:items-baseline py-4 border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 -mx-4 px-4 rounded-lg transition-colors">
                {/* Date Column */}
                <div className="sm:w-32 flex-shrink-0 text-sm font-mono text-neutral-400 dark:text-neutral-600 mb-1 sm:mb-0 pt-1">
                  {post.date}
                </div>
                
                {/* Content Column */}
                <div className="flex-grow">
                  <Link to={`/${post.slug}`} className="block">
                    {/* Title defaults to neutral, turns Red #d93d3d on hover */}
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white group-hover:text-[#d93d3d] transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  {query && (
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {post.summary}
                    </p>
                  )}
                  
                  {!query && (
                    <div className="mt-1 hidden group-hover:block animate-fade-in">
                       <span className="text-xs text-neutral-400 dark:text-neutral-600">
                         {post.category}
                       </span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            没有找到与 "{query}" 相关的文章。
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;