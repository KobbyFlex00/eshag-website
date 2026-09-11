import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsService } from '../services/api';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsService.getProjects()
      .then(res => setProjects(res.data?.results || res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.project_type === filter);

  return (
    <div className="py-16 space-y-12">
      <div className="container-custom max-w-4xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Portfolio & Case Studies
        </span>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
          Delivered Civil & Building Works
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Explore completed and active construction developments across residential estates, commercial facilities, and engineering structures in Ghana.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {['all', 'residential', 'commercial', 'industrial', 'renovation'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                filter === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container-custom">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading project records...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(proj => {
              const displayImg =
                proj.featured_image_url ||
                proj.featured_image ||
                (proj.images && proj.images.length > 0 ? (proj.images[0].image_url || proj.images[0].image) : null);

              return (
                <div
                  key={proj.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-56 bg-slate-900 relative overflow-hidden">
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Building2 className="w-12 h-12" />
                        </div>
                      )}
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                        proj.project_status === 'completed' ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        {proj.project_status}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                        {proj.project_type}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 transition">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        {proj.location}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {proj.short_description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      View Project Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500">
            No projects found in this category.
          </div>
        )}
      </div>
    </div>
  );
}