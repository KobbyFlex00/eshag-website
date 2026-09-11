import React, { useEffect, useState } from 'react';
import { careersService } from '../services/api';
import { Briefcase, MapPin, Clock, Send, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    years_of_experience: 1,
    cover_letter: '',
    resume: null,
  });

  useEffect(() => {
    careersService.getJobs()
      .then((res) => {
        const list = res.data?.results || res.data || [];
        setJobs(list);
        if (list.length > 0) setSelectedJob(list[0]);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      setError('Please attach your CV / resume (PDF or DOCX format).');
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = new FormData();
    payload.append('job', selectedJob?.id || '');
    payload.append('applicant_name', formData.applicant_name);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('years_of_experience', formData.years_of_experience);
    payload.append('cover_letter', formData.cover_letter);
    payload.append('resume', formData.resume);

    try {
      await careersService.submitApplication(payload);
      setSuccess(true);
      setFormData({
        applicant_name: '',
        email: '',
        phone: '',
        years_of_experience: 1,
        cover_letter: '',
        resume: null,
      });
    } catch {
      setError('An error occurred while submitting your application. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 space-y-12">
      <div className="container-custom max-w-4xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Join The Team</span>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">Careers at ESHAG</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Build your civil engineering and construction career with a team committed to professional standards, on-site safety, and technical growth.
        </p>
      </div>

      <div className="container-custom max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Open Roles */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Available Openings</h3>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-6 rounded-2xl border cursor-pointer transition ${
                  selectedJob?.id === job.id
                    ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{job.title}</h4>
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    {job.employment_type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-3">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                  {job.department && <span>• {job.department}</span>}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <Briefcase className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Active Positions Listed</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                General trade submissions can still be forwarded through our contact desk.
              </p>
            </div>
          )}
        </div>

        {/* Candidate Application Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Submit Application</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {selectedJob ? `Applying for: ${selectedJob.title}` : 'Select a position from the left to begin.'}
          </p>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Application received! Our HR team reviews incoming candidate qualifications weekly.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="applicant_name"
                required
                value={formData.applicant_name}
                onChange={handleChange}
                placeholder="e.g., George Osae"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="candidate@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="059 953 5884"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Years of Practical Experience
              </label>
              <input
                type="number"
                name="years_of_experience"
                min="0"
                max="40"
                value={formData.years_of_experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Resume / CV (PDF or DOCX) *
              </label>
              <input
                type="file"
                name="resume"
                required
                accept=".pdf,.docx,.doc"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-amber-100 dark:file:bg-amber-900/50 file:text-amber-800 dark:file:text-amber-300 file:font-semibold file:text-xs transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                name="cover_letter"
                rows="4"
                value={formData.cover_letter}
                onChange={handleChange}
                placeholder="Share a brief overview of relevant site projects and skills..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition shadow-md"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}