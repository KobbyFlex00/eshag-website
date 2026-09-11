import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Cost Estimator', path: '/estimator' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container-custom flex items-center justify-between h-20">
        {/* Official Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/eshag-logo.png"
            alt="ESHAG Building and Construction"
            className="h-12 w-auto object-contain rounded-lg drop-shadow-sm group-hover:scale-105 transition duration-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-tight">
              ESHAG
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
              Building & Construction
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xs font-semibold uppercase tracking-wider transition ${
                location.pathname === link.path
                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle & Quote CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to="/request-quote"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            Request a Quote
          </Link>
        </div>

        {/* Mobile Toggle Drawer Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-700 dark:text-slate-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/request-quote"
            onClick={() => setIsOpen(false)}
            className="block text-center bg-amber-600 text-white py-3 rounded-xl text-xs font-semibold"
          >
            Request a Quote
          </Link>
        </div>
      )}
    </header>
  );
}