import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  cmsService, 
  servicesService, 
  projectsService, 
  coreService, 
  testimonialsService 
} from '../services/api';
import { 
  ArrowRight, ShieldCheck, Ruler, Building2, HardHat, 
  CheckCircle2, Clock, MapPin, Star, ChevronRight, PhoneCall
} from 'lucide-react';
import ProjectCarousel from '../components/projects/ProjectCarousel';

export default function HomePage() {
  const [pageData, setPageData] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const [pageRes, servicesRes, featProjectsRes, statsRes, faqsRes, testRes] = await Promise.all([
          cmsService.getPage('home').catch(() => null),
          servicesService.getServices({ featured: true }).catch(() => ({ data: { results: [] } })),
          projectsService.getProjects().catch(() => ({ data: { results: [] } })),
          coreService.getStatistics().catch(() => ({ data: [] })),
          coreService.getFaqs().catch(() => ({ data: { results: [] } })),
          testimonialsService.getApproved().catch(() => ({ data: { results: [] } }))
        ]);

        if (pageRes?.data) setPageData(pageRes.data);
        setServices(servicesRes?.data?.results || servicesRes?.data || []);
        
        // Grab all projects (prioritize featured if any, else show all projects)
        const allProjects = featProjectsRes?.data?.results || featProjectsRes?.data || [];
        const featuredList = allProjects.filter(p => p.featured);
        setProjects(featuredList.length > 0 ? featuredList : allProjects);

        setStats(Array.isArray(statsRes?.data) ? statsRes.data : []);
        setFaqs(faqsRes?.data?.results || faqsRes?.data || []);
        setTestimonials(testRes?.data?.results || testRes?.data || []);
      } finally {
        setLoading(false);
      }
    }
    loadHomeContent();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white py-24 lg:py-32 overflow-hidden border-b border-slate-800">
        {/* Dynamic Cloudinary Hero Image Background */}
        {pageData?.hero_image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={pageData.hero_image} 
              alt={pageData.hero_headline || "ESHAG Construction Hero"} 
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/60 backdrop-blur-[1px]" />
          </div>
        )}

        {/* Fallback Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none z-0"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <HardHat className="w-3.5 h-3.5" />
              Ghana's Premier Civil & Building Contractors
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-md">
              {pageData?.hero_headline || "Building Dreams. Constructing Futures."}
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed drop-shadow-sm">
              {pageData?.hero_subheadline || "Delivering excellence in residential developments, commercial facilities, and professional civil project management across Greater Accra and beyond."}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={pageData?.hero_cta_url || "/request-quote"}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition transform active:scale-95"
              >
                {pageData?.hero_cta_text || "Request a Quote"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/estimator"
                className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm transition"
              >
                Cost Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Stats Counters */}
      {stats.length > 0 && (
        <section className="-mt-28 relative z-20">
          <div className="container-custom">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center transition-colors">
              {stats.map((s) => (
                <div key={s.id} className="border-r last:border-r-0 border-slate-100 dark:border-slate-800">
                  <div className="text-3xl lg:text-4xl font-extrabold text-amber-600 mb-1">
                    {s.value}{s.suffix}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Project Carousel Showcase */}
      {projects.length > 0 && (
        <section className="container-custom pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Visual Site Progress
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">
                Featured Construction Gallery
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProjectCarousel projects={projects} autoPlay={true} interval={5000} />
        </section>
      )}

      {/* Core Services Section */}
      <section className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Specialized Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">Our Core Services</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1">
            Explore All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((svc) => (
            <div key={svc.id} className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{svc.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{svc.short_description}</p>
                {svc.features && svc.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {svc.features.map((f) => (
                      <li key={f.id} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{f.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link to={`/services/${svc.slug}`} className="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 pt-4 border-t border-slate-100 dark:border-slate-800">
                View Specifications <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {faqs.length > 0 && (
        <section className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Client Guidance</span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Direct Quote CTA */}
      <section className="container-custom">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-10 lg:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-3 text-white">Have a Construction Project in Mind?</h2>
            <p className="text-amber-100 text-sm leading-relaxed">
              Schedule a site inspection or submit your architectural drawings for an itemized quotation today.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/request-quote" className="bg-slate-900 hover:bg-slate-950 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md transition">
              Request a Quote
            </Link>
            <a href="tel:0599535884" className="inline-flex items-center gap-2 bg-white text-amber-800 font-semibold px-6 py-3.5 rounded-xl shadow-md transition">
              <PhoneCall className="w-4 h-4 text-amber-600" /> 059 953 5884
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}