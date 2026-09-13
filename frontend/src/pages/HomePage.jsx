import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  HardHat,
  Ruler,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Award,
  Users,
  ChevronDown
} from 'lucide-react';
import TestimonialsSection from '../components/TestimonialsSection';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eshag-website.onrender.com/api/v1';

// Helper to unpack both DRF paginated objects and direct raw arrays
const unpackResponse = (res) => {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function HomePage() {
  const [stats, setStats] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [statsRes, servicesRes, projectsRes, testimonialsRes, faqsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/core/statistics/`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/services/?featured=true`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/projects/`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/testimonials/`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/core/faqs/`).catch(() => ({ data: [] })),
        ]);

        setStats(unpackResponse(statsRes));
        setServices(unpackResponse(servicesRes));
        setProjects(unpackResponse(projectsRes));
        setTestimonials(unpackResponse(testimonialsRes));
        setFaqs(unpackResponse(faqsRes));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#070C18] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Hero Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dce9e8zz5/image/upload/v1/media/services/WhatsApp_Image_2026-09-12_at_4.46.20_AM_ubrilr"
            alt="ESHAG Architectural Project"
            className="w-full h-full object-cover object-center filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070C18]/80 via-transparent to-[#070C18]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <HardHat className="w-3.5 h-3.5" />
            GHANA&apos;S PREMIER CIVIL &amp; BUILDING CONTRACTORS
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Building Dreams Across Ghana.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Constructing Futures.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 mb-10 leading-relaxed">
            Delivering excellence in residential developments, commercial facilities, and professional civil project management across Greater Accra and beyond.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm sm:text-base"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/cost-estimator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 font-bold rounded-xl backdrop-blur-sm transition-all text-sm sm:text-base"
            >
              <Calculator className="w-4 h-4 text-orange-400" />
              Cost Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="py-12 bg-slate-950 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.length > 0 ? (
              stats.map((stat, idx) => (
                <div key={stat.id || idx} className="p-4">
                  <div className="text-3xl sm:text-5xl font-extrabold text-orange-500 mb-2">
                    {stat.value}
                    {stat.suffix || ''}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-4">
                  <div className="text-3xl sm:text-5xl font-extrabold text-orange-500 mb-2">120+</div>
                  <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Completed Projects
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-3xl sm:text-5xl font-extrabold text-orange-500 mb-2">12+</div>
                  <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Years Experience
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-3xl sm:text-5xl font-extrabold text-orange-500 mb-2">99%</div>
                  <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Client Satisfaction
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-3xl sm:text-5xl font-extrabold text-orange-500 mb-2">45+</div>
                  <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Site Engineers &amp; Artisans
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-orange-500 font-semibold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            OUR EXPERTISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Comprehensive Construction Solutions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From luxury residential villas to heavy civil works, ESHAG delivers structural longevity with disciplined execution.
          </p>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id || service.slug}
                className="group flex flex-col bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {service.featured_image && (
                  <div className="h-48 overflow-hidden bg-slate-950">
                    <img
                      src={service.featured_image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed line-clamp-3">
                      {service.short_description || service.description}
                    </p>
                  </div>
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 text-slate-200 hover:text-white text-sm font-semibold transition-all"
          >
            Explore All Capabilities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS CAROUSEL / GRID */}
      {projects.length > 0 && (
        <section className="py-24 bg-slate-950/60 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="inline-block text-orange-500 font-semibold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                  PROVEN PORTFOLIO
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Featured Developments &amp; Sites
                </h2>
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400 mt-4 md:mt-0"
              >
                View Complete Portfolio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id || proj.slug}
                  className="group bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl overflow-hidden transition-all"
                >
                  {proj.featured_image && (
                    <div className="h-56 overflow-hidden">
                      <img
                        src={proj.featured_image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wide">
                      {proj.category || 'Construction'}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2 group-hover:text-orange-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">{proj.location}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TESTIMONIALS SECTION (Mounted directly) */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      {faqs.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
          <div className="text-center mb-16">
            <span className="inline-block text-orange-500 font-semibold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              QUESTIONS &amp; CLARIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Answers to common inquiries regarding project permits, contracts, and diaspora management.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.id || index}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-semibold text-white text-base sm:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-orange-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}