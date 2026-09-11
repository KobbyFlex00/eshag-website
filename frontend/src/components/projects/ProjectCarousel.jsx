import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Building2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectCarousel({ projects = [], autoPlay = true, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = projects.flatMap((p) => {
    const list = [];
    if (p.featured_image || p.featured_image_url) {
      list.push({
        id: `feat-${p.id}`,
        imageUrl: p.featured_image_url || p.featured_image,
        title: p.title,
        location: p.location,
        category: p.project_type,
        slug: p.slug,
        caption: p.short_description
      });
    }
    if (p.images && p.images.length > 0) {
      p.images.forEach((img) => {
        list.push({
          id: `gallery-${img.id}`,
          imageUrl: img.image_url || img.image,
          title: p.title,
          location: p.location,
          category: p.project_type,
          slug: p.slug,
          caption: img.caption || p.title
        });
      });
    }
    return list;
  });

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, slides.length, interval]);

  if (slides.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <div
      className="relative w-full h-[420px] sm:h-[520px] lg:h-[600px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-slate-950">
        <img
          src={current.imageUrl}
          alt={current.title}
          className="w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-amber-600 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/60 hover:bg-amber-600 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 z-20"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-0 inset-x-0 p-8 sm:p-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3 h-3" />
            {current.category}
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mb-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            {current.location}
          </p>
          {current.caption && (
            <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">
              {current.caption}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/projects/${current.slug}`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg transition"
          >
            <Eye className="w-4 h-4" /> View Full Case Study
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-8 bg-amber-500'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}