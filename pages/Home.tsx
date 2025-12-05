import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { dataService } from '../services/dataService';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Get all posts for the feed
    dataService.getAllPosts().then(data => {
      // Sort by date descending (newest first) using string comparison
      // This is more robust on mobile browsers (Safari) than new Date() parsing
      const sortedData = [...data].sort((a, b) => b.date.localeCompare(a.date));
      setPosts(sortedData);
    });
  }, []);

  return (
    <div className="space-y-16 animate-fade-in pt-8">
      {posts.map((post) => (
        <article key={post.id} className="group">
          <Link to={`/${post.slug}`} className="block space-y-3">
            {/* Title with default color, turning Red (#d93d3d) on Hover */}
            <h2 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white transition-colors duration-200 group-hover:text-[#d93d3d]">
              {post.title}
            </h2>
            
            {/* Content Preview / Summary */}
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {post.summary}
            </p>

            {/* Read Full Text Button */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white border-b border-neutral-300 dark:border-neutral-700 pb-0.5 group-hover:border-[#d93d3d] dark:group-hover:border-[#ff6b6b] transition-colors">
                阅读全文
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default Home;