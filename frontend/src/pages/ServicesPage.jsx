import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  HardHat,
  Ruler,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eshag-website.onrender.com/api/v1';

const ICON_MAP = {
  Building2: Building2,
  HardHat: HardHat,
  Ruler: Ruler,
  Wrench: Wrench,
  ShieldCheck: ShieldCheck,
};

const resolveImageUrl = (img) => {
  if (!img) return '';
  if (typeof img !== 'string') return img?.url || '';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('media/') || img.startsWith('/media/')) {
    const cleanPath = img.startsWith('/') ? img.slice(1) : img;
    return `https://res.cloudinary.com/dce9e8zz5/image/upload/v1/${cleanPath}`;
  }
  return `https://eshag-website.onrender.com${img.startsWith('/') ? '' : '/'}${img}`;
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/services/`);
        
        const data = response.data;
        const normalizedServices = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];

        setServices(normalizedServices);
      } catch (err) {
        console.error('Failed to load services:', err);
        setError('Unable to load our services catalog. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const resolveIcon = (iconName) => {
    const Component = ICON_MAP[iconName] || Building2;
    return <Component className="w-8 h-8 text-orange-500" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-orange-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block text-orange-500 font-semibold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            SPECIALIZED CAPABILITIES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Construction & Civil Engineering Services
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            ESHAG provides end-to-end building solutions with transparent cost management, structural integrity, and
            timeline compliance across Ghana.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading specialized services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/60 rounded-2xl border border-red-500/30 p-8 shadow-sm">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 font-semibold rounded-lg text-white transition-colors"
            >
              Retry
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
            <Building2 className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Services Published Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Services are currently being updated in the administrative portal. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id || service.slug}
                className="group flex flex-col bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-orange-500/40 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5"
              >
                {/* Image */}
                {service.featured_image ? (
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img
                      src={resolveImageUrl(service.featured_image)}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                  </div>
                ) : (
                  <div className="h-28 w-full bg-slate-100 dark:bg-slate-950/60 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/60">
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                      {resolveIcon(service.icon)}
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-orange-500 tracking-wide uppercase">
                        {service.featured ? 'Featured Service' : 'Core Service'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                      {service.name}
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {service.short_description || service.description?.slice(0, 160)}
                    </p>

                    {/* Features List */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-2.5 mb-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        {service.features.slice(0, 3).map((feat) => (
                          <div key={feat.id || feat.title} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <span>{feat.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/contact"
                      className="text-xs font-medium px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global CTA Banner */}
        <div className="mt-20 relative bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Need a Custom Construction or Structural Proposal?
            </h3>
            <p className="text-orange-100 text-sm sm:text-base mb-8 leading-relaxed">
              Our registered civil engineers, structural estimators, and project leads are ready to review your
              architectural blueprints or conduct an on-site feasibility evaluation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/cost-estimator"
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
              >
                Launch Cost Estimator
              </Link>
              <a
                href="tel:0599535884"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm rounded-xl backdrop-blur-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                Call Engineering Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}