import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Tag,
  Search,
  Filter
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eshag-website.onrender.com/api/v1';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);

        const [postsRes, catsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/blog/posts/`),
          axios.get(`${API_BASE_URL}/blog/categories/`).catch(() => ({ data: [] }))
        ]);

        // Unpack both direct arrays and DRF paginated responses
        const rawPosts = postsRes.data;
        const normalizedPosts = Array.isArray(rawPosts)
          ? rawPosts
          : rawPosts?.results || rawPosts?.data || [];

        const rawCats = catsRes.data;
        const normalizedCats = Array.isArray(rawCats)
          ? rawCats
          : rawCats?.results || rawCats?.data || [];

        setPosts(normalizedPosts);
        setCategories(normalizedCats);
      } catch (err) {
        console.error('Failed to load blog records:', err);
        setError('Unable to load articles. Please check back shortly.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Filter posts by category and search term
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      post.category === selectedCategory ||
      post.category?.slug === selectedCategory ||
      post.category?.name === selectedCategory ||
      post.category?.id?.toString() === selectedCategory.toString();

    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently Published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-orange-500/10 via-transparent to-transparent opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block text-orange-500 font-semibold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            INSIGHTS & FIELD GUIDES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
            Construction & Civil Engineering Journal
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            Practical articles on building codes in Ghana, foundation techniques, structural integrity standards, and
            cost optimization.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const identifier = cat.slug || cat.id;
              const isActive = selectedCategory === identifier;
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => setSelectedCategory(identifier)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Loading field articles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-slate-900/60 rounded-2xl border border-red-500/30 p-8">
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 font-semibold rounded-lg text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-20 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              New Articles in Editorial Review
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Check back soon for engineering case studies and regulatory construction tips.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id || post.slug}
                className="group flex flex-col bg-slate-900/60 hover:bg-slate-900 border border-slate-800/90 hover:border-orange-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/5"
              >
                {/* Cover Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 border-b border-slate-800">
                      <BookOpen className="w-12 h-12 text-slate-700 group-hover:text-orange-500/60 transition-colors" />
                    </div>
                  )}
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-orange-400 font-semibold text-xs rounded-full">
                      {typeof post.category === 'object'
                        ? post.category?.name
                        : post.category || 'Engineering'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Metadata Header */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        {post.read_time_minutes || 4} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors leading-snug">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6">
                      {post.excerpt || post.content?.slice(0, 140)}...
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      Read Full Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}