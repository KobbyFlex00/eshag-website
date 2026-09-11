import React, { useEffect, useState } from 'react';
import { coreService } from '../services/api';
import { ShieldCheck, HardHat, Award, Target, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coreService.getTeam()
      .then((res) => {
        setTeam(res.data?.results || res.data || []);
      })
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-16 space-y-20">
      <div className="container-custom max-w-4xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Our Foundation & Philosophy
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mt-2">
          Engineering Integrity, Delivered On-Site
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base mt-4 leading-relaxed">
          ESHAG Building and Construction is a premier construction firm headquartered in Greater Accra, Ghana. We specialize in residential design-build developments, commercial complexes, structural reinforcement, and civil project management.
        </p>
      </div>

      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To build structures characterized by technical durability and cost transparency, ensuring every homeowner and institutional client receives verified engineering value.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Standards</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Adherence to Ghana National Building Codes, laboratory batch testing of concrete mixes, certified structural rebar gauges, and transparent project accounting.
          </p>
        </div>
      </div>

      {/* Dynamic Team Section connected to Django Admin */}
      <section className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Leadership & Management
          </span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Meet the Project Engineers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            The technical team directing site safety, quality assurance, and structural delivery.
          </p>
        </div>

        {team.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center hover:border-amber-400 transition"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-amber-500 flex items-center justify-center">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{member.name}</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">{member.role}</p>
                {member.bio && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-3">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Team profiles are managed live via the Operations Dashboard.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}