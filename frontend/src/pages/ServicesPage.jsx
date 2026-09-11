import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesService } from '../services/api';
import { Building2, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesService.getServices()
      .then(res => setServices(res.data.results || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-16 space-y-12">
      <div className="container-custom">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Specialized Capabilities</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-2 mb-4">Construction & Civil Engineering Services</h1>
          <p className="text-slate-600 leading-relaxed">
            ESHAG provides end-to-end building solutions with transparent cost management, structural integrity, and timeline compliance across Ghana.
          </p>
        </div>
      </div>

      <div className="container-custom">
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading verified services catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div key={svc.id} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-amber-400 shadow-sm transition flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{svc.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{svc.short_description}</p>
                  
                  {svc.features && svc.features.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Deliverables</span>
                      {svc.features.map((f) => (
                        <div key={f.id} className="text-xs text-slate-700 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{f.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link to={`/services/${svc.slug}`} className="text-sm font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1">
                    Full Details <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/request-quote" className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md transition">
                    Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}