"use client";

import { useEffect, useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { RxDotFilled } from "react-icons/rx";
import { apiRequest } from "@/lib/apiClient";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0";
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${Number(amount).toLocaleString("en-NG")}`;
};

export default function RecentActivities() {
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

  return (
    <div className="py-6 px-4 md:px-8 border-2 border-[#F1F5F9] rounded-3xl bg-white shadow-sm w-full overflow-hidden">

      <div className="flex justify-between mb-6">
        <h3 className="font-semibold text-[20px] md:text-[24px]">Recent Activities</h3>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-4 py-3">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-24" />
                <div className="h-3 bg-gray-50 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-400 text-center py-6">Failed to load: {error}</p>
      )}

      {!loading && !error && properties.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No activities found.</p>
      )}

      {/* Desktop — proper table */}
      {!loading && !error && properties.length > 0 && (
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F1F5F9]">
                <th className="w-14 pb-3" />
                <th className="text-left pb-3 text-[11px] font-semibold text-[#90A1B9] uppercase tracking-wider">Property</th>
                <th className="text-right pb-3 text-[11px] font-semibold text-[#90A1B9] uppercase tracking-wider px-3">Receivable</th>
                <th className="text-right pb-3 text-[11px] font-semibold text-[#90A1B9] uppercase tracking-wider px-3">Received</th>
                <th className="text-right pb-3 text-[11px] font-semibold text-[#90A1B9] uppercase tracking-wider px-3">Balance</th>
                <th className="text-right pb-3 text-[11px] font-semibold text-[#90A1B9] uppercase tracking-wider pl-3">Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((item, idx) => {
                const hasBalance = item.balance > 0;
                return (
                  <tr key={idx} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition">
                    <td className="py-4 pr-2">
                      <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] flex items-center justify-center">
                        <GoArrowUpRight className="text-[#00A63E] text-[18px]" />
                      </div>
                    </td>
                    <td className="py-4 pr-3">
                      <p className="text-[14px] font-semibold text-[#0F172A]">{item.name}</p>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <p className="text-[14px] font-semibold text-[#0F172A] whitespace-nowrap">
                        {formatCurrency(item.receivable)}
                      </p>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <p className="text-[14px] font-medium text-[#00A63E] whitespace-nowrap">
                        {formatCurrency(item.received)}
                      </p>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <p className={`text-[14px] font-semibold whitespace-nowrap ${hasBalance ? "text-red-500" : "text-[#00A63E]"}`}>
                        {hasBalance ? formatCurrency(item.balance) : "Paid ✓"}
                      </p>
                    </td>
                    <td className="py-4 pl-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <RxDotFilled className="text-[#DDA04E] text-[16px] flex-shrink-0" />
                        <p className="text-[13px] text-[#90A1B9] whitespace-nowrap">{item.date || "—"}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile — card layout */}
      {!loading && !error && properties.length > 0 && (
        <div className="flex flex-col gap-3 md:hidden">
          {properties.map((item, idx) => {
            const hasBalance = item.balance > 0;
            return (
              <div key={idx} className="bg-[#F8FAFC] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                    <GoArrowUpRight className="text-[#00A63E] text-[16px]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#0F172A]">{item.name}</p>
                    <div className="flex items-center gap-1">
                      <RxDotFilled className="text-[#DDA04E] text-[14px]" />
                      <p className="text-[12px] text-[#90A1B9]">{item.date || "—"}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Receivable", value: formatCurrency(item.receivable), color: "text-[#0F172A]" },
                    { label: "Received",   value: formatCurrency(item.received),   color: "text-[#00A63E]" },
                    { label: "Balance",    value: hasBalance ? formatCurrency(item.balance) : "Paid ✓", color: hasBalance ? "text-red-500" : "text-[#00A63E]" },
                  ].map(col => (
                    <div key={col.label} className="bg-white rounded-xl p-2">
                      <p className="text-[10px] text-[#90A1B9] uppercase tracking-wide mb-0.5">{col.label}</p>
                      <p className={`text-[12px] font-semibold ${col.color}`}>{col.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
