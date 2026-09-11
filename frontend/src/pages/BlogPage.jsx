import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getCategories().then(res => setCategories(res.data.results || res.data || [])).catch(() => []);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = selectedCat !== 'all' ? { category__slug: selectedCat } : {};
    blogService.getPosts(params)
      .then(res => setPosts(res.data.results || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [selectedCat]);

  return (
    <div className="py-16 space-y-12">
      <div className="container-custom">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Insights & Field Guides</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Construction & Civil Engineering Journal</h1>
          <p className="text-slate-600 leading-relaxed">
            Practical articles on building codes in Ghana, foundation techniques, structural integrity standards, and cost optimization.
          </p>
        </div>

        {/* Categories Toolbar */}
        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-slate-200">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCat === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCat === cat.slug
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="container-custom">
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading articles...</div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="h-48 bg-slate-100 relative">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen className="w-10 h-10" />
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        {post.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {post.read_time_minutes} min read
                      </span>
                      <span>•</span>
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-amber-600 transition">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 pt-2"
                  >
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-xl mx-auto">
            <BookOpen className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">New Articles in Editorial Review</h3>
            <p className="text-xs text-slate-600">Check back soon for engineering case studies and regulatory construction tips.</p>
          </div>
        )}
      </div>
    </div>
  );
}