import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eshag-website.onrender.com/api/v1';

export default function TestimonialsSection({ testimonials: initialTestimonials }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(!initialTestimonials || initialTestimonials.length === 0);

  useEffect(() => {
    if (initialTestimonials && initialTestimonials.length > 0) {
      setTestimonials(initialTestimonials);
      setLoading(false);
      return;
    }

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/testimonials/`);
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : raw?.results || raw?.data || [];

        const approved = list
          .filter((item) => item.is_approved !== false)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        setTestimonials(approved);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [initialTestimonials]);

  if (loading) {
    return (
      <section className="py-24 bg-slate-50 dark:bg-[#070C18] border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading client testimonials...</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];
  const clientName = current.client_name || current.name || 'Valued Client';
  const clientTitle = current.client_title || current.title || current.role || 'Property Owner';
  const companyName = current.company_name || '';
  const quoteText = current.quote || current.content || current.text || '';
  const ratingValue = current.rating || 5;
  const avatarUrl = current.avatar || current.image;

  const initials = clientName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-white relative border-t border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-orange-500 font-semibold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            CLIENT SATISFACTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Trusted by Homeowners &amp; Corporate Developers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Read verified reviews from clients across Greater Accra and the diaspora who trusted ESHAG with their structural investments.
          </p>
        </div>

        {/* Highlighted Testimonial Feature Card */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-orange-500/30 rounded-3xl p-8 sm:p-12 shadow-xl dark:shadow-2xl relative transition-all">
          <Quote className="w-16 h-16 text-orange-500/15 absolute top-8 right-8 pointer-events-none" />

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < ratingValue ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
            <span className="ml-3 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
              Verified Review
            </span>
          </div>

          {/* Quote */}
          <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-200 leading-relaxed italic mb-8 font-light">
            &ldquo;{quoteText}&rdquo;
          </p>

          {/* Author Details & Carousel Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={clientName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-orange-500"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-500/40 text-orange-500 font-bold flex items-center justify-center text-lg">
                  {initials}
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                  {clientName}
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {clientTitle} {companyName ? `• ${companyName}` : ''}
                </p>
              </div>
            </div>

            {/* Slider Navigation */}
            {testimonials.length > 1 && (
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={prevTestimonial}
                  aria-label="Previous testimonial"
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-orange-500 text-slate-700 dark:text-slate-300 hover:text-white transition-all border border-slate-200 dark:border-slate-700 hover:border-orange-500"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">
                  {currentIndex + 1} / {testimonials.length}
                </span>
                <button
                  onClick={nextTestimonial}
                  aria-label="Next testimonial"
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-orange-500 text-slate-700 dark:text-slate-300 hover:text-white transition-all border border-slate-200 dark:border-slate-700 hover:border-orange-500"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3-Column Mini Grid */}
        {testimonials.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
            {testimonials.slice(0, 3).map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  currentIndex === idx
                    ? 'bg-white dark:bg-slate-900 border-orange-500/60 shadow-lg shadow-orange-500/5'
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 italic">
                  &ldquo;{item.quote || item.content}&rdquo;
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.client_name || item.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {item.client_title || item.title}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}