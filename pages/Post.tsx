import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { marked } from 'marked'; 
import { dataService } from '../services/dataService';
import { BlogPost } from '../types';

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      const data = await dataService.getPostBySlug(slug);
      if (data) {
        setPost(data);
        if (data.content) {
          const parsed = await marked.parse(data.content);
          setHtmlContent(parsed);
        }
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!post) return <div className="p-10 text-center">Post not found</div>;

  return (
    <article className="max-w-3xl mx-auto animate-fade-in pt-10">
      <Link to="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back
      </Link>
      
      <header className="mb-10">
        <div className="flex items-center space-x-4 text-xs text-neutral-500 mb-4 font-mono uppercase tracking-wider">
          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {post.date}</span>
          <span className="flex items-center"><Tag size={12} className="mr-1" /> {post.category}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-neutral-900 dark:text-neutral-100 leading-tight">
          {post.title}
        </h1>
      </header>

      <div 
        className="prose prose-neutral dark:prose-invert max-w-none 
        prose-headings:font-serif prose-headings:font-bold 
        prose-a:text-[#d93d3d] prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </article>
  );
};

export default Post;
