import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';
import { 
  Building2, Users, FileText, CheckCircle2, 
  Briefcase, Bell, ExternalLink, RefreshCw, LogOut,
  Activity, ArrowUpRight, Images, PlusCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    setRefreshing(true);
    try {
      const [mRes, nRes] = await Promise.allSettled([
        dashboardService.getMetrics(),
        dashboardService.getNotifications()
      ]);

      if (mRes.status === 'fulfilled' && mRes.value?.data) {
        setMetrics(mRes.value.data);
      }
      
      if (nRes.status === 'fulfilled') {
        const notifData = nRes.value?.data?.results || nRes.value?.data || [];
        setNotifications(Array.isArray(notifData) ? notifData : []);
      }
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const markRead = async (id) => {
    try {
      await dashboardService.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await dashboardService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const cards = metrics?.summary_cards || {};
  const recentActivity = metrics?.recent_activity || [];

  const cardConfig = [
    {
      label: 'Total Projects',
      value: cards.total_projects ?? 0,
      subtext: `${cards.active_projects ?? 0} active on-site`,
      subtextColor: 'text-amber-600',
      adminPath: 'projects/project/'
    },
    {
      label: 'CRM Leads',
      value: cards.total_leads ?? 0,
      subtext: `${cards.new_leads ?? 0} new pipeline`,
      subtextColor: 'text-emerald-600',
      adminPath: 'leads/lead/'
    },
    {
      label: 'Quote Requests',
      value: cards.quote_requests ?? 0,
      subtext: 'Specifications filed',
      subtextColor: 'text-slate-400',
      adminPath: 'leads/quoterequest/'
    },
    {
      label: 'Inquiries',
      value: cards.contact_messages ?? 0,
      subtext: 'Contact desk forms',
      subtextColor: 'text-slate-400',
      adminPath: 'leads/contactmessage/'
    },
    {
      label: 'Applications',
      value: cards.job_applications ?? 0,
      subtext: 'Candidate resumes',
      subtextColor: 'text-slate-400',
      adminPath: 'careers/jobapplication/'
    },
    {
      label: 'Articles',
      value: cards.blog_posts ?? 0,
      subtext: 'Published live',
      subtextColor: 'text-slate-400',
      adminPath: 'blog/blogpost/'
    }
  ];

  return (
    <div className="py-12 space-y-10">
      <div className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Operations Control</span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">Management Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <strong className="text-slate-800 dark:text-slate-200">{user?.username || 'admin'}</strong> ({user?.role || 'Staff'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Functional Animated Refresh Button */}
          <button
            type="button"
            onClick={loadDashboard}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl hover:border-amber-400 dark:hover:border-amber-500 transition disabled:opacity-50 shadow-sm active:scale-95"
            title="Reload metrics and feeds from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-md"
          >
            Django Admin <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured Banner: Landing Page Carousel & Cloudinary Controls */}
      <div className="container-custom">
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Images className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Landing Page Project Carousel (Cloudinary)</h3>
              <p className="text-xs text-amber-100 mt-1 max-w-xl">
                Upload new project photos, reorder carousel slides, or update featured image tags directly into Cloudinary media storage.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="http://127.0.0.1:8000/admin/projects/projectimage/add/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white text-amber-800 hover:bg-amber-50 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Add Carousel Image
            </a>
            <a
              href="http://127.0.0.1:8000/admin/projects/projectimage/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-slate-900/60 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition border border-white/20"
            >
              Manage Carousel <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cardConfig.map((item, idx) => (
            <a
              key={idx}
              href={`http://127.0.0.1:8000/admin/${item.adminPath}`}
              target="_blank"
              rel="noreferrer"
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600 mb-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{item.value}</div>
              </div>
              <span className={`text-[10px] font-semibold mt-2 ${item.subtextColor}`}>
                {item.subtext}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Two-Column Ledger: Notifications & Audit Feed */}
      <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Incoming Notifications</h3>
            </div>
            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                Mark All Read
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                    notif.is_read
                      ? 'bg-slate-50/70 dark:bg-slate-850/50 border-slate-100 dark:border-slate-800 opacity-70'
                      : 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => markRead(notif.id)}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold shrink-0"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No new alerts in the notification ledger.
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Audit Feed</h3>
            </div>
            <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Live Log</span>
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{act.action}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{act.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">By: {act.user}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent audit events recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}