"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Users, Wallet, Building } from "lucide-react";
import AddPropertyModal from "./AddPropertyModal";
import { apiRequest } from "@/lib/apiClient";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "—";
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${amount.toLocaleString()}`;
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
};

function StatCard({ label, value, icon: Icon, iconBg, iconColor, trend, trendColor, dark }) {
  return (
    <div className={`rounded-2xl p-6 shadow-lg h-45 hover:shadow-md transition duration-300 ${dark ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-sm font-semibold ${dark ? "text-gray-400" : "text-gray-600"}`}>{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-full flex justify-center items-center ${iconBg}`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>
        {value ?? <span className="text-gray-300 animate-pulse">...</span>}
      </p>
      {trend && <p className={`text-sm font-semibold ${trendColor || "text-gray-400"}`}>{trend}</p>}
    </div>
  );
}

function Overview() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Single state for everything from the sheet
  const [sheetData, setSheetData]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const loadSheetData = () => {
    setLoading(true);
    apiRequest("/admin/sheet/overview-full")
      .then(d => {
        if (d.success) setSheetData(d);
        else setError(d.message);
      })
      .catch(err => { console.error("Sheet overview error", err); setError(err.message); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSheetData(); }, []);

  const stats        = sheetData?.stats        || {};
  const portfolio    = sheetData?.portfolio    || [];
  const topInvestors = sheetData?.topInvestors || [];

  return (
    <div className="min-h-screen p-4 md:p-0">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition duration-200"
        >
          Add Property
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ❌ Failed to load sheet data: {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Receivable"
          value={loading ? null : formatCurrency(stats.totalReceivable)}
          icon={Wallet} iconBg="bg-[#F0FDF4]" iconColor="text-[#00A63E]"
          trend="Total amount receivable from sheet" trendColor="text-green-600"
        />
        <StatCard
          label="Total Investors"
          value={loading ? null : stats.totalInvestors?.toLocaleString()}
          icon={Users} iconBg="bg-[#EFF6FF]" iconColor="text-blue-500"
          trend="Total investors from sheet" trendColor="text-blue-600"
        />
        <StatCard
          label="Rental Income"
          value={formatCurrency(0)}
          icon={Building} iconBg="bg-[#DDA04E1A]" iconColor="text-[#DDA04E]"
          trend="Total approved rent collected" trendColor="text-teal-600"
        />
        <StatCard
          label="Action Required" value="0"
          icon={AlertCircle} iconBg="" iconColor="text-red-500"
          trend="Pending rent payment requests" trendColor="text-gray-400" dark
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Assets Portfolio Table — from sheet */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Assets Portfolio</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Project", "No. of Clients", "A.U.M per Project", "Asset Type"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">Loading from sheet...</td></tr>
                ) : portfolio.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">No properties found in sheet.</td></tr>
                ) : portfolio.map((p) => (
                  <tr key={p.name} className="border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                    <td className="py-4 px-4 text-gray-900 font-medium">{p.name}</td>
                    <td className="py-4 px-4 text-gray-700">{p.clientCount}</td>
                    <td className="py-4 px-4 text-gray-700 font-semibold">{formatCurrency(p.aum)}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-[#DDA04E1A] text-[#DDA04E]">
                        {p.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Investors — from sheet */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Top Investors</h2>
          <p className="text-gray-500 text-sm mb-6">Highest investment per client</p>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
            ) : topInvestors.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No investors yet.</p>
            ) : topInvestors.map((inv) => (
              <div key={inv.email} className="pb-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 p-2 rounded-lg transition duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-black font-semibold text-[10px]">{getInitials(inv.fullName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold w-[70%] text-[12px]">{inv.fullName}</p>
                    <p className="text-gray-500 text-[11px] truncate">
                      {inv.propertiesCount} {inv.propertiesCount === 1 ? "property" : "properties"}
                    </p>
                  </div>
                  <p className="text-[#00A63E] font-bold text-[12px] whitespace-nowrap ml-2">
                    {formatCurrency(inv.totalInvestment)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <a href="/admin/sheet">
          <button className="w-full mt-6 py-3 text-gray-900 font-semibold hover:bg-gray-50 rounded-lg transition duration-200 border border-gray-200">
            View All Investors
          </button>
          </a>
        </div>
      </div>

      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadSheetData}
      />
    </div>
  );
}

export default Overview;
