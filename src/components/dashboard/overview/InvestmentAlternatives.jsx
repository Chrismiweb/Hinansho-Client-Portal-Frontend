"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
// import Image from "next/image";
import { apiRequest } from "@/lib/apiClient";

// ── helpers ───────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0";
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${Number(amount).toLocaleString()}`;
};

const PLACEHOLDER = "/assets/property.jpg";

// ── main component ────────────────────────────────────────────────────────────
export default function InvestmentAlternatives() {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiRequest("/investor/investment-alternatives");
        if (data.success) setAlternatives(data.alternatives);
        else throw new Error(data.message || "Failed to load alternatives");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section className="w-full">
      <div className="w-full bg-white rounded-[36px] border border-gray-200 px-6 py-8 shadow-sm sm:px-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Investment Alternatives
          </h2>
          <p className="mt-1 text-base text-slate-500">
            View other investment alternatives
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-6 animate-pulse">
                <div className="w-[50px] h-[44px] rounded-md bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-40" />
                  <div className="h-3 bg-gray-100 rounded w-56" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-20 hidden md:block" />
                <div className="h-4 bg-gray-200 rounded w-16 hidden md:block" />
                <div className="h-9 bg-gray-200 rounded-2xl w-28" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-sm text-red-500 text-center py-6">{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && alternatives.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">
              🎉 You own all available properties! Check back later for new listings.
            </p>
          </div>
        )}

        {/* List */}
        {!loading && !error && alternatives.length > 0 && (
          <div className="space-y-10">
            {alternatives.map((item) => (
              <div
                key={item.id}
                className="grid w-full grid-cols-[56px_1.5fr_auto] md:grid-cols-[56px_1.5fr_1fr_1fr_auto] items-center gap-x-4 md:gap-x-6"
              >
                {/* Image */}
                <div className="relative h-[44px] w-[50px] overflow-hidden rounded-md flex-shrink-0">
                  <img
                    src={item.image || PLACEHOLDER}
                    alt={item.title}
                    className="object-cover"
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                </div>

                {/* Title + description */}
                <div className="flex flex-col min-w-0">
                  <p className="text-[16px] font-bold text-black truncate">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] text-gray-500 truncate">
                    {item.description || item.location}
                  </p>
                </div>

                {/* Price — hidden on mobile */}
                <p className="hidden md:block text-[16px] font-bold text-[#111827]">
                  {formatCurrency(item.price)}
                </p>

                {/* Category — hidden on mobile */}
                <p className="hidden md:block text-[16px] text-[#1f2937]">
                  {item.category}
                </p>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="flex items-center justify-center gap-[10px] rounded-[16px] bg-[#0f172a] px-[14px] py-[8px] text-[14px] font-normal text-white shadow-[0_12px_22px_rgba(15,23,42,0.18)] transition hover:bg-[#1e293b] whitespace-nowrap"
                >
                  Learn More
                  <ArrowUpRight size={15} strokeWidth={2} />
                </button>

                {/* Price + Category on mobile */}
                <div className="col-span-3 flex gap-6 text-sm md:hidden mt-1">
                  <p className="font-bold text-slate-900">{formatCurrency(item.price)}</p>
                  <p className="text-slate-600">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={selected.image || PLACEHOLDER}
                alt={selected.title}
                className="object-cover"
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">{selected.title}</h3>

            {selected.location && (
              <p className="mt-1 text-sm text-slate-400">📍 {selected.location}</p>
            )}

            <p className="mt-2 text-sm text-slate-500">{selected.description}</p>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-bold text-slate-900">{formatCurrency(selected.price)}</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-4">
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-bold text-slate-900">{selected.category}</p>
              </div>
              {selected.totalUnits > 0 && (
                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-xs text-gray-500">Total Units</p>
                  <p className="font-bold text-slate-900">{selected.totalUnits}</p>
                </div>
              )}
              {selected.expectedRoi > 0 && (
                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-xs text-gray-500">Expected ROI</p>
                  <p className="font-bold text-slate-900">{selected.expectedRoi}%</p>
                </div>
              )}
            </div>

            <button className="mt-6 w-full rounded-2xl bg-slate-950 py-3 font-medium text-white transition hover:bg-slate-800">
              Contact Us
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
