import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesService } from '../services/api';
import { Building2, CheckCircle2, ArrowRight, HardHat, PhoneCall } from 'lucide-react';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesService.getServiceBySlug(slug)
      .then(res => setService(res.data))
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-24 text-center text-slate-500">Loading service specifications...</div>;
  if (!service) return <div className="py-24 text-center text-slate-700">Service not found.</div>;

  return (
    <div className="py-16 space-y-12">
      <div className="container-custom">
        <div className="max-w-3xl">
          <Link to="/services" className="text-xs font-semibold text-amber-600 uppercase tracking-wider hover:underline mb-2 inline-block">
            ← Back to All Services
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mt-1 mb-4">{service.name}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">{service.short_description}</p>
        </div>
      </div>

      <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Overview & Methodology</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{service.description}</p>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Service Deliverables & Standards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat) => (
                  <div key={feat.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
                      {feat.description && <p className="text-xs text-slate-600 mt-1">{feat.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-lg">
            <h3 className="text-lg font-bold mb-3">Request a Project Consultation</h3>
            <p className="text-sm text-slate-400 mb-6">
              Our site engineers and estimators are available to discuss site feasibility and scope.
            </p>
            <Link to="/request-quote" className="w-full inline-flex justify-center items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition mb-4">
              Get an Estimate <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:0599535884" className="w-full inline-flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold py-3 rounded-xl transition">
              <PhoneCall className="w-4 h-4 text-amber-500" /> 059 953 5884
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}