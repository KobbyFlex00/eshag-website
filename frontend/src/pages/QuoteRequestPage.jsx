import React, { useState } from 'react';
import { leadsService } from '../services/api';
import { Upload, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function QuoteRequestPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    project_type: 'Residential Construction',
    project_location: '',
    project_description: '',
    estimated_budget: '',
    desired_start_date: '',
    additional_message: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) payload.append(key, formData[key]);
    });
    if (attachment) payload.append('attachment', attachment);

    try {
      await leadsService.submitQuote(payload);
      setStatusMsg('success');
      setFormData({
        full_name: '', email: '', phone: '', project_type: 'Residential Construction',
        project_location: '', project_description: '', estimated_budget: '',
        desired_start_date: '', additional_message: ''
      });
      setAttachment(null);
    } catch (err) {
      setStatusMsg('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="container-custom max-w-4xl">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Technical Estimations</span>
          <h1 className="text-4xl font-bold text-slate-900 mt-1 mb-3">Request a Project Quotation</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Provide your site specifications and upload architectural drawings or structural documents for an itemized estimate.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          {statusMsg === 'success' && (
            <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Your quote request has been submitted. Our engineering desk will review the parameters and contact you.</span>
            </div>
          )}

          {statusMsg === 'error' && (
            <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Failed to submit quote request. Please confirm all required fields are populated.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Details */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
                  <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="e.g., George Osae" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="client@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="059 953 5884" />
                </div>
              </div>
            </div>

            {/* Scope Details */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Project Parameters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Project Category *</label>
                  <select name="project_type" value={formData.project_type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm">
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Commercial Construction">Commercial Construction</option>
                    <option value="Renovation & Remodeling">Renovation & Remodeling</option>
                    <option value="Project Management">Project Management & Supervision</option>
                    <option value="Civil Engineering & Consultation">Civil Engineering & Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Site Location *</label>
                  <input type="text" name="project_location" required value={formData.project_location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="e.g., Airport Residential, East Legon, Tema" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Estimated Budget (Optional)</label>
                  <input type="text" name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="e.g., GHS 500,000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Target Start Date</label>
                  <input type="date" name="desired_start_date" value={formData.desired_start_date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Project Description *</label>
                <textarea name="project_description" required rows={4} value={formData.project_description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" placeholder="Number of floors, estimated square meters, specific finishing requirements..." />
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Architectural Documents & Drawings</h3>
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-amber-500 transition">
                <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <label className="cursor-pointer text-sm font-semibold text-amber-600 hover:text-amber-700">
                  <span>Upload PDF, CAD drawing or image</span>
                  <input type="file" onChange={handleFile} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.dwg" />
                </label>
                {attachment && (
                  <p className="text-xs text-slate-600 mt-2 font-medium">Selected file: {attachment.name}</p>
                )}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full inline-flex justify-center items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow-lg transition">
              {submitting ? 'Submitting Specifications...' : 'Send Quotation Request'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}