import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsService } from '../services/api';
import { MapPin, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsService.getProjectBySlug(slug)
      .then((res) => setProject(res.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-32 text-center text-slate-500">Loading project case study...</div>;
  if (!project) return <div className="py-32 text-center text-slate-700 dark:text-slate-300">Project not found.</div>;

  // Fallback to the first gallery image if no featured_image was uploaded on the project
  const firstGalleryImage = project.images && project.images.length > 0
    ? (project.images[0].image_url || project.images[0].image)
    : null;
  const coverUrl = project.featured_image_url || project.featured_image || firstGalleryImage;

  return (
    <div className="pt-10 pb-20 space-y-10">
      <div className="container-custom">
        <Link to="/projects" className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider hover:underline mb-3 inline-block">
          ← Back to Project Portfolio
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-amber-600" /> {project.location}
              {project.project_code && <span className="text-slate-300 dark:text-slate-700">|</span>}
              {project.project_code && <span>Code: {project.project_code}</span>}
            </p>
          </div>
          <span className={`self-start md:self-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
            project.project_status === 'completed' ? 'bg-emerald-600' : 'bg-amber-600'
          }`}>
            {project.project_status}
          </span>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="container-custom">
        <div className="h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-900 relative">
          {coverUrl ? (
            <img src={coverUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <Building2 className="w-16 h-16" />
            </div>
          )}
        </div>
      </div>

      {/* Narrative, Progress & Gallery */}
      <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Project Description</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {project.description || project.short_description}
            </p>
          </div>

          {/* Construction Progress Log */}
          {project.updates && project.updates.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Construction Progress Log</h3>
              <div className="space-y-6">
                {project.updates.map((up) => (
                  <div key={up.id} className="pb-6 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{up.title}</h4>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        {up.percentage_complete}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mb-3 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${up.percentage_complete}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{up.description}</p>
                    <span className="text-[11px] text-slate-400 mt-2 block">Logged on {up.update_date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Photo Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Site Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.images.map((img) => (
                  <div key={img.id} className="h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img
                      src={img.image_url || img.image}
                      alt={img.caption || project.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Parameters */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Project Parameters
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Category:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{project.project_type}</span>
              </div>
              {project.client_name && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Client:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{project.client_name}</span>
                </div>
              )}
              {project.start_date && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Commencement:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{project.start_date}</span>
                </div>
              )}
              {project.completion_date && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Handover:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{project.completion_date}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 border border-slate-800">
            <h4 className="font-bold mb-2">Build a Similar Development?</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Our estimators can produce a site feasibility budget based on your design goals.
            </p>
            <Link
              to="/request-quote"
              className="w-full inline-flex justify-center items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-3 rounded-xl transition"
            >
              Request Quote <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}