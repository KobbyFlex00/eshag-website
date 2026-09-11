import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/api';
import { Clock, Calendar, ArrowRight, BookOpen, User } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getPostBySlug(slug)
      .then(res => setPost(res.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-24 text-center text-slate-500">Loading article...</div>;
  if (!post) return <div className="py-24 text-center text-slate-700">Article not found.</div>;

  return (
    <article className="py-16 space-y-10">
      <div className="container-custom max-w-4xl">
        <Link to="/blog" className="text-xs font-semibold text-amber-600 uppercase tracking-wider hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-6 border-b border-slate-200">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="w-3.5 h-3.5 text-amber-600" /> {post.author_name || 'ESHAG Editorial Team'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> {post.read_time_minutes} min read
          </span>
          <span>•</span>
          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}</span>
        </div>
      </div>

      {post.featured_image && (
        <div className="container-custom max-w-4xl">
          <div className="h-72 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm leading-relaxed text-slate-800 text-base space-y-6 whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </article>
  );
}