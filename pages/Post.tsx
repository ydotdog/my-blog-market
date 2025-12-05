import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { BlogPost } from '../types';
import { dataService } from '../services/dataService';

declare global {
  interface Window {
    marked: {
      parse: (text: string) => string;
    };
  }
}

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    dataService.getPostBySlug(slug).then(foundPost => {
      if (foundPost) {
        setPost({ ...foundPost }); // Clone to trigger re-render
      } else {
        console.error("Post not found");
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce mx-1"></div>
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce mx-1 delay-75"></div>
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce mx-1 delay-150"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">文章不存在</h2>
        <Link to="/archive" className="text-neutral-600 hover:text-black underline">返回归档</Link>
      </div>
    );
  }

  // Parse Markdown to HTML
  const htmlContent = post.content && window.marked 
    ? window.marked.parse(post.content) 
    : post.content || '';

  return (
    <article className="animate-fade-in max-w-2xl mx-auto">
      {/* Back Link */}
      <div className="mb-8">
        <Link to="/archive" className="inline-flex items-center text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
          <ArrowLeft size={16} className="mr-1" />
          归档
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10 space-y-4">
        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400 font-mono">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {post.date}
          </span>
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs text-neutral-600 dark:text-neutral-300">
            {post.category}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
          {post.title}
        </h1>
      </header>

      {/* Content */}
      <div 
        className="prose prose-neutral dark:prose-invert prose-lg max-w-none 
        prose-headings:font-serif prose-headings:font-bold 
        prose-a:text-neutral-900 dark:prose-a:text-white prose-a:underline prose-a:decoration-neutral-300 dark:prose-a:decoration-neutral-600 hover:prose-a:decoration-black dark:hover:prose-a:decoration-white prose-a:underline-offset-4
        prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
};

export default Post;