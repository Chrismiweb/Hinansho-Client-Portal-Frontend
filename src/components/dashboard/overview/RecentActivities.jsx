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
    <div className="py-[20px] md:py-[40px] px-[20px] lg:px-[38px] border-2 border-[#F1F5F9] rounded-3xl bg-white shadow-sm">

      {/* Header */}
      <div className="flex justify-between mb-7">
        <h3 className="font-semibold text-[20px] md:text-[24px]">Recent Activities</h3>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-4 py-3">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-50 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-20 hidden md:block" />
              <div className="h-4 bg-gray-100 rounded w-16 hidden md:block" />
              <div className="h-4 bg-gray-100 rounded w-24 hidden md:block" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-sm text-red-400 text-center py-6">Failed to load: {error}</p>
      )}

      {/* Empty */}
      {!loading && !error && properties.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No activities found.</p>
      )}

      {/* Table */}
      {!loading && !error && properties.length > 0 && (
        <div className="overflow-x-auto">
          {/* Table headers */}
          <div className="hidden md:grid grid-cols-[auto_1fr_140px_120px_120px_130px] items-center gap-4 px-2 mb-3">
            <div className="w-12" />
            <p className="text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider">Property</p>
            <p className="text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider">Receivable</p>
            <p className="text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider">Received</p>
            <p className="text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider">Balance</p>
            <p className="text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider">Purchase Date</p>
          </div>

          <div className="space-y-3">
            {properties.map((item, idx) => {
              const hasBalance = item.balance > 0;
              return (
                <div
                  key={idx}
                  className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_140px_120px_120px_130px] items-center gap-4 p-3 rounded-2xl hover:bg-[#F8FAFC] transition"
                >
                  {/* Icon */}
                  <div className="text-[22px] p-3 rounded-2xl bg-[#F0FDF4] text-[#00A63E] inline-block flex-shrink-0">
                    <GoArrowUpRight />
                  </div>

                  {/* Property name + date (mobile) */}
                  <div>
                    <p className="text-[15px] font-semibold text-[#0F172A]">{item.name}</p>
                    <div className="flex items-center gap-1 md:hidden">
                      <RxDotFilled className="text-[#DDA04E]" />
                      <p className="text-[12px] text-[#90A1B9]">{item.date || "—"}</p>
                    </div>
                    {/* Mobile amounts */}
                    <div className="flex gap-3 mt-1 md:hidden text-[12px]">
                      <span className="text-[#0F172A] font-medium">{formatCurrency(item.receivable)}</span>
                      {hasBalance && (
                        <span className="text-red-500 font-medium">Bal: {formatCurrency(item.balance)}</span>
                      )}
                    </div>
                  </div>

                  {/* Receivable */}
                  <div className="hidden md:block">
                    <p className="text-[14px] font-semibold text-[#0F172A]">
                      {formatCurrency(item.receivable)}
                    </p>
                  </div>

                  {/* Received */}
                  <div className="hidden md:block">
                    <p className="text-[14px] font-medium text-[#00A63E]">
                      {formatCurrency(item.received)}
                    </p>
                  </div>

                  {/* Balance Outstanding */}
                  <div className="hidden md:block">
                    <p className={`text-[14px] font-semibold ${hasBalance ? "text-red-500" : "text-[#00A63E]"}`}>
                      {hasBalance ? formatCurrency(item.balance) : "Paid ✓"}
                    </p>
                  </div>

                  {/* Purchase Date */}
                  <div className="hidden md:flex items-center gap-1">
                    <RxDotFilled className="text-[#DDA04E] text-[18px]" />
                    <p className="text-[13px] text-[#90A1B9]">{item.date || "—"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
