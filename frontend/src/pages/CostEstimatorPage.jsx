import React, { useState } from 'react';
import { assistantService } from '../services/api';
import { Calculator, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CostEstimatorPage() {
  const [formData, setFormData] = useState({
    project_type: 'residential',
    floor_area_sqm: 180,
    number_of_floors: 1,
    finish_quality: 'standard',
    client_name: '',
    client_phone: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['floor_area_sqm', 'number_of_floors'].includes(name) ? Number(value) : value,
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await assistantService.calculateEstimate(formData);
      setResult(res.data);
    } catch {
      // Offline / fallback calculation using Ghana standard construction ranges
      const rates = {
        standard: 3800,
        premium: 5200,
        luxury: 7200,
      };
      const baseRate = rates[formData.finish_quality] || 4000;
      const totalArea = formData.floor_area_sqm * formData.number_of_floors;
      const estimatedCost = totalArea * baseRate;

      setResult({
        estimated_cost_ghs: estimatedCost,
        low_range_ghs: estimatedCost * 0.9,
        high_range_ghs: estimatedCost * 1.15,
        total_area: totalArea,
        currency: 'GHS',
        breakdown: [
          { phase: 'Substructure & Foundation', percentage: 22, amount: estimatedCost * 0.22 },
          { phase: 'Reinforced Concrete Superstructure', percentage: 28, amount: estimatedCost * 0.28 },
          { phase: 'Masonry, Roofing & Partitions', percentage: 20, amount: estimatedCost * 0.20 },
          { phase: 'MEP (Plumbing & Electrical Engineering)', percentage: 15, amount: estimatedCost * 0.15 },
          { phase: 'Finishes, Tilework & Coatings', percentage: 15, amount: estimatedCost * 0.15 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 space-y-12">
      <div className="container-custom max-w-4xl text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Feasibility Modeling
        </span>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
          Construction Cost Estimator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Obtain an instantaneous preliminary budget based on building footprint, number of floors, and structural finish grades in Ghana.
        </p>
      </div>

      <div className="container-custom max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Parameters Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <form onSubmit={handleCalculate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Project Category
              </label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              >
                <option value="residential">Residential Villa / Home</option>
                <option value="commercial">Commercial / Office Complex</option>
                <option value="industrial">Industrial Warehouse</option>
                <option value="renovation">Renovation & Remodeling</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Floor Area (SQM)
                </label>
                <input
                  type="number"
                  name="floor_area_sqm"
                  min="30"
                  max="10000"
                  required
                  value={formData.floor_area_sqm}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Number of Floors
                </label>
                <input
                  type="number"
                  name="number_of_floors"
                  min="1"
                  max="20"
                  required
                  value={formData.number_of_floors}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Finishing Grade
              </label>
              <select
                name="finish_quality"
                value={formData.finish_quality}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              >
                <option value="standard">Standard Quality (Durable Local & Commercial Materials)</option>
                <option value="premium">Premium Quality (Imported Porcelain, Custom Joinery)</option>
                <option value="luxury">Luxury Grade (Smart Automation, Custom Architectural Façade)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                Optional: Save this estimate to our project management desk
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="client_name"
                  placeholder="Your Name"
                  value={formData.client_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
                <input
                  type="tel"
                  name="client_phone"
                  placeholder="Phone Number"
                  value={formData.client_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              {loading ? 'Calculating Feasibility...' : 'Calculate Estimate'}
            </button>
          </form>
        </div>

        {/* Dynamic Calculation Output */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          {result ? (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
                  Projected Investment (GHS)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  GH₵ {Number(result.estimated_cost_ghs).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Estimated Range: GH₵ {Number(result.low_range_ghs).toLocaleString(undefined, { maximumFractionDigits: 0 })} – GH₵ {Number(result.high_range_ghs).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              {result.breakdown && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Phase-By-Phase Distribution
                  </h4>
                  <div className="space-y-2.5">
                    {result.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 dark:text-slate-400">{item.phase}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          GH₵ {Number(item.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                This calculation serves as a general guide. Final contract figures depend on structural soil test reports, foundation depth requirements, and current material market prices.
              </div>

              <Link
                to="/request-quote"
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 rounded-xl transition"
              >
                Submit Drawings for Itemized Bill of Quantities <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 dark:text-slate-600">
              <Calculator className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Awaiting Calculation</h4>
              <p className="text-xs">Adjust your project area and grade on the left to review the projected investment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}