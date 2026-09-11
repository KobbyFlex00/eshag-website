import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { coreService } from '../../services/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    coreService.getSettings()
      .then((res) => setSettings(res.data))
      .catch(() => null);
  }, []);

  const phoneDisplay = settings?.primary_phone || "059 953 5884 / 024 139 5502";
  const emailDisplay = settings?.primary_email || "Eshagbuildingandconst@gmail.com";
  const addressDisplay = settings?.office_address || "Kpone Katamanso, Greater Accra, Ghana";

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/eshag-logo.png"
              alt="ESHAG Building and Construction"
              className="h-10 w-auto object-contain rounded-md"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-xl font-bold tracking-tight text-white">ESHAG</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Premier building and civil engineering construction services in Ghana. Delivering durability, structural precision, and modern residential and commercial spaces.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {/* Instagram SVG */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-amber-500 transition"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* YouTube SVG */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:text-amber-500 transition"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Fast Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/about" className="hover:text-amber-500 transition">→ About Company</Link></li>
            <li><Link to="/services" className="hover:text-amber-500 transition">→ Our Services</Link></li>
            <li><Link to="/projects" className="hover:text-amber-500 transition">→ Project Portfolio</Link></li>
            <li><Link to="/estimator" className="hover:text-amber-500 transition">→ Construction Estimator</Link></li>
            <li><Link to="/careers" className="hover:text-amber-500 transition">→ Career Openings</Link></li>
          </ul>
        </div>

        {/* Divisions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Services</h4>
          <ul className="space-y-2 text-xs">
            <li>Residential Construction</li>
            <li>Commercial Developments</li>
            <li>Renovation & Remodeling</li>
            <li>Project Management & Supervision</li>
            <li>Structural Feasibility Consultation</li>
          </ul>
        </div>

        {/* Direct Contacts */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Get in Touch</h4>
          <div className="space-y-2.5 text-xs">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{addressDisplay}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{phoneDisplay}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <a href={`mailto:${emailDisplay}`} className="hover:text-amber-400 transition">{emailDisplay}</a>
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 ESHAG Building and Construction. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/contact" className="hover:text-amber-500">Privacy & Terms</Link>
          <Link to="/login" className="hover:text-amber-500">Staff Desk</Link>
        </div>
      </div>
    </footer>
  );
}