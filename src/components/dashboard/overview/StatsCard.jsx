"use client";

import { useEffect, useState } from "react";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { LuLeaf, LuBuilding2 } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { GiWheat } from "react-icons/gi";
import { apiRequest } from "@/lib/apiClient";

// ── Fixed categories with fixed colors ───────────────────────────────────────
const CATEGORIES = [
  { key: "land",           label: "Land",           hex: "#DDA04E", bg: "bg-[#FFF3E0]", color: "text-[#DDA04E]", icon: LuBuilding2         },
  { key: "farm",           label: "Farm",            hex: "#00A63E", bg: "bg-[#DCFCE7]", color: "text-[#00A63E]", icon: LuLeaf              },
  { key: "apartment",      label: "Apartment",       hex: "#155DFC", bg: "bg-[#EFF6FF]", color: "text-blue-600",  icon: IoHomeOutline       },
  { key: "rental_income",  label: "Rental Income",   hex: "#7C3AED", bg: "bg-[#EDE9FE]", color: "text-[#7C3AED]", icon: TbBuildingSkyscraper },
  { key: "agro_returns",   label: "Agro Returns",    hex: "#92400E", bg: "bg-[#FEF3C7]", color: "text-[#92400E]", icon: GiWheat             },
];

// ── Classify property into a category ────────────────────────────────────────
const classifyProperty = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("verda") || n.includes("farm")) return "farm";
  if (n.includes("apartment") || n.includes("studio")) return "apartment";
  if (n.includes("hr") || n.includes("land") || n.includes("pavilion") || n.includes("pavillion")) return "land";
  return "land"; // default
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0";
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${Number(amount).toLocaleString("en-NG")}`;
};

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ segments, total }) {
  const radius        = 70;
  const stroke        = 14;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <svg width="180" height="180" className="flex-shrink-0">
      <circle cx="90" cy="90" r={radius} stroke="#E2E8F0" strokeWidth={stroke} fill="none" />
      {segments.filter(s => s.value > 0).map((seg, i) => {
        const percent  = total > 0 ? (seg.value / total) * 100 : 0;
        const rotation = -90 + (cumulativePercent / 100) * 360;
        cumulativePercent += percent;
        return (
          <circle
            key={i}
            cx="90" cy="90" r={radius}
            stroke={seg.hex}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percent / 100) * circumference}
            strokeLinecap="round"
            transform={`rotate(${rotation} 90 90)`}
            className="transition-all duration-700 ease-out"
          />
        );
      })}
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const StatsCard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    apiRequest("/investor/sheet-overview")
      .then(res => {
        if (res.success) setProperties(res.data.properties || []);
        else throw new Error(res.message);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Group received amounts by category
  const categoryTotals = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = 0;
    return acc;
  }, {});

  properties.forEach(prop => {
    const cat = classifyProperty(prop.name);
    if (categoryTotals[cat] !== undefined) {
      categoryTotals[cat] += prop.received || 0;
    }
  });

  // Rental income and agro returns always 0 for now
  categoryTotals["rental_income"] = 0;
  categoryTotals["agro_returns"]  = 0;

  const totalReceived = properties.reduce((sum, p) => sum + (p.received || 0), 0);

  // Chart segments — only categories with value > 0
  const chartSegments = CATEGORIES.map(cat => ({
    hex:   cat.hex,
    value: categoryTotals[cat.key],
  }));

  if (loading) return (
    <div className="border-2 bg-white border-[#F1F5F9] rounded-3xl shadow-sm p-6 w-full animate-pulse">
      <div className="h-6 bg-gray-100 rounded w-24 mb-6" />
      <div className="w-[180px] h-[180px] rounded-full bg-gray-100 mx-auto mb-8" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 bg-gray-50 rounded-2xl" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="border-2 bg-white border-[#F1F5F9] rounded-3xl shadow-sm p-6 w-full">
      <p className="text-sm text-red-400 text-center py-10">Failed to load: {error}</p>
    </div>
  );

  return (
    <div className="border-2 bg-white border-[#F1F5F9] rounded-3xl shadow-sm p-5 w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900">Portfolio Stats</h2>
      </div>

      {/* Donut Chart */}
      <div className="relative flex items-center justify-center mb-6">
        <DonutChart segments={chartSegments} total={totalReceived} />
        <div className="absolute text-center pointer-events-none">
          <p className="text-[10px] tracking-widest text-[#90A1B9] uppercase">Total Paid</p>
          <p className="text-[20px] font-bold text-[#0F172B] leading-tight">
            {formatCurrency(totalReceived)}
          </p>
        </div>
      </div>

      {/* Category rows */}
      <div className="space-y-2">
        {CATEGORIES.map(cat => {
          const amount  = categoryTotals[cat.key] || 0;
          const Icon    = cat.icon;
          const percent = totalReceived > 0
            ? Math.round((amount / totalReceived) * 100)
            : 0;

          return (
            <div key={cat.key} className="flex items-center gap-3 bg-[#F8FAFC] rounded-2xl p-3">
              <div className={`p-2 rounded-full flex-shrink-0 ${cat.bg}`}>
                <Icon className={`text-[20px] ${cat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.hex }} />
                  <p className="font-semibold text-[14px] text-slate-900">{cat.label}</p>
                </div>
                <p className="text-[12px] text-[#62748E]">{percent}% of total</p>
              </div>
              <p className="font-bold text-[14px] text-slate-900 flex-shrink-0 whitespace-nowrap">
                {formatCurrency(amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCard;
