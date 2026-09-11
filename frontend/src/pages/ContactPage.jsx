import React, { useState, useEffect } from 'react';
import { leadsService, coreService } from '../services/api';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    coreService.getSettings()
      .then(res => setSettings(res.data))
      .catch(() => null);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await leadsService.submitContact(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('An error occurred submitting your inquiry. Please reach us via our direct phone line.');
    } finally {
      setLoading(false);
    }
  };

  const emailDisplay = settings?.primary_email || "Eshagbuildingandconst@gmail.com";
  const phoneDisplay = settings?.primary_phone || "059 953 5884 / 024 139 5502";
  const addressDisplay = settings?.office_address || "Kpone Katamanso, Greater Accra Region, Ghana";
  const workingHoursDisplay = settings?.working_hours || "Mon - Fri: 8:00 AM - 5:00 PM";

  return (
    <div className="py-16 space-y-12">
      <div className="container-custom max-w-4xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Direct Consultation</span>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">Contact Our Engineering Desk</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Inquire about land acquisition support, residential designs, project feasibility, or schedule a physical site inspection.
        </p>
      </div>

      <div className="container-custom max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Office Information</h3>
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <span>{addressDisplay}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
              <span>{phoneDisplay}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
              <a href={`mailto:${emailDisplay}`} className="hover:underline font-semibold text-slate-800 dark:text-slate-200">{emailDisplay}</a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
              <span>{workingHoursDisplay}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send an Inquiry</h3>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you. Your message has been routed to our project managers. We will respond within 24 business hours.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="e.g., Emmanuel Mensah"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="059 953 5884"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  placeholder="Residential inquiry"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Message *</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                placeholder="Describe your site location, project requirements, or schedule preferences..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition inline-flex items-center gap-2 shadow-md"
            >
              {loading ? 'Submitting...' : 'Submit Message'} <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}