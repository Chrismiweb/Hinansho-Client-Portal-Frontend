"use client";

import { useEffect, useState } from "react";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { RiPieChartLine } from "react-icons/ri";
import { LuLeaf } from "react-icons/lu";
import { LuMapPin } from "react-icons/lu";
import { LuBuilding2 } from "react-icons/lu";
// import { LuHome } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { apiRequest } from "@/lib/apiClient";

// ── Icon + color per property type / name ────────────────────────────────────
const getPropertyStyle = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("verda") || n.includes("farm")) {
    return { icon: LuLeaf, bg: "bg-[#DCFCE7]", color: "text-[#00A63E]" };
  }
  if (n.includes("pavillon") || n.includes("pavilion") || n.includes("hostel")) {
    return { icon: TbBuildingSkyscraper, bg: "bg-slate-200", color: "text-[#45556C]" };
  }
  if (n.includes("hr") || n.includes("campus") || n.includes("land")) {
    return { icon: RiPieChartLine, bg: "bg-[#DDA04E33]", color: "text-[#DDA04E]" };
  }
  if (n.includes("apartment")) {
    return { icon: IoHomeOutline, bg: "bg-[#EFF6FF]", color: "text-blue-500" };
  }
  return { icon: LuBuilding2, bg: "bg-[#F1F5F9]", color: "text-[#64748B]" };
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0";
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${Number(amount).toLocaleString("en-NG")}`;
};

// ── Donut chart segments ──────────────────────────────────────────────────────
function DonutChart({ segments, total }) {
  const radius = 70;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;

  // Build segments from received amounts
  const COLORS = ["#DDA04E", "#00A63E", "#155E75", "#7C3AED", "#E7000B", "#155DFC"];

  let cumulativePercent = 0;

  return (
    <svg width="180" height="180">
      {/* Background ring */}
      <circle cx="90" cy="90" r={radius} stroke="#1E293B" strokeWidth={stroke} fill="none" />

      {segments.map((seg, i) => {
        const percent = total > 0 ? (seg.received / total) * 100 : 0;
        const dashArray = circumference;
        const dashOffset = circumference - (percent / 100) * circumference;
        const rotation = -90 + (cumulativePercent / 100) * 360;
        cumulativePercent += percent;

        if (percent === 0) return null;

        return (
          <circle
            key={i}
            cx="90" cy="90" r={radius}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(${rotation} 90 90)`}
            className="transition-all duration-700 ease-out"
          />
        );
      })}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
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

  // Total received across all properties (excludes rental income = 0)
  const totalReceived = properties.reduce((sum, p) => sum + (p.received || 0), 0);
  // Total income = totalReceived + rental (0 for now)
  const totalIncome = totalReceived;

  if (loading) {
    return (
      <div className="border-2 bg-white border-[#F1F5F9] rounded-3xl shadow-sm p-6 w-full lg:max-w-sm animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-24 mb-6" />
        <div className="w-[180px] h-[180px] rounded-full bg-gray-100 mx-auto mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-2 bg-white border-[#F1F5F9] rounded-3xl shadow-sm p-6 w-full lg:max-w-sm">
        <p className="text-sm text-red-400 text-center py-10">Failed to load: {error}</p>
      </div>
    );
  }

  return (
    <div className="border-2 bg-white border-[#F1F5F9] rounded-3xl shadow-sm p-6 w-full lg:max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Statistics</h2>
      </div>

      {/* Donut Chart */}
      <div className="relative flex items-center justify-center mb-8">
        {properties.length > 0 ? (
          <DonutChart segments={properties} total={totalReceived} />
        ) : (
          <svg width="180" height="180">
            <circle cx="90" cy="90" r={70} stroke="#1E293B" strokeWidth={14} fill="none" />
          </svg>
        )}

        {/* Center text */}
        <div className="absolute text-center">
          <p className="text-xs tracking-widest text-[#90A1B9]">TOTAL PAID</p>
          <p className="text-[22px] font-bold text-[#0F172B]">
            {formatCurrency(totalIncome)}
          </p>
        </div>
      </div>

      {/* Rental Income — always show as 0 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-slate-200">
              <TbBuildingSkyscraper className="text-[#45556C] text-[24px]" />
            </div>
            <div>
              <p className="font-semibold text-[16px] text-slate-900">Rental Income</p>
              <p className="text-[13px] text-[#62748E]">0% of total</p>
            </div>
          </div>
          <p className="font-bold text-[18px] text-slate-900">₦0</p>
        </div>

        {/* Dynamic property rows */}
        {properties.map((prop, i) => {
          const style = getPropertyStyle(prop.name);
          const Icon  = style.icon;
          // % of receivable that has been paid for this property
          const percent = prop.receivable > 0
            ? Math.round((prop.received / prop.receivable) * 100)
            : 0;

          return (
            <div key={i} className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${style.bg}`}>
                  <Icon className={`${style.color} text-[24px]`} />
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-slate-900">{prop.name}</p>
                  <p className="text-[12px] text-[#62748E]">
                    {percent}% of receivable paid
                    {prop.balance > 0 && (
                      <span className="ml-2 text-red-400 font-medium">
                        · Bal: {formatCurrency(prop.balance)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <p className="font-bold text-[16px] text-slate-900 whitespace-nowrap">
                {formatCurrency(prop.received)}
              </p>
            </div>
          );
        })}

        {/* If no properties */}
        {properties.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-400">
            No property data found for your account.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
