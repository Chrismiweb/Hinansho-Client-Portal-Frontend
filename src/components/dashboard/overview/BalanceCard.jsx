"use client";

import { useEffect, useState } from "react";
import { LuWallet } from "react-icons/lu";
import { PiBuildingsBold } from "react-icons/pi";
import { GiWheat } from "react-icons/gi";
import { apiRequest } from "@/lib/apiClient";
import { LuLeaf } from "react-icons/lu";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0.00";
  return `₦${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

function SummaryCard({ title, value, dark, icon, loading }) {
  return (
    <div className={`rounded-2xl px-6 pt-[24px] pb-[28px] ${dark ? "bg-[#0F172B] text-white" : "bg-white shadow-lg border-2 border-[#F1F5F9]"}`}>
      <div className="flex w-full items-center justify-between md:hidden">
        <div className="text-[25px] p-3 inline-block mb-2 bg-[#FFFFFF33] rounded-[10px]">{icon}</div>
      </div>
      <div className="text-[25px] hidden md:inline-block p-3 mb-2 bg-[#FFFFFF33] rounded-[10px]">{icon}</div>
      <p className="text-[14px] text-[#90A1B9] font-bold">{title}</p>
      <h3 className="text-[20px] font-bold mt-1">
        {loading
          ? <span className="inline-block w-24 h-6 bg-white/20 rounded animate-pulse" />
          : value
        }
      </h3>
    </div>
  );
}

export default function BalanceCard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    apiRequest("/investor/sheet-overview")
      .then(res => {
        if (res.success) setData(res.data);
        else throw new Error(res.message || "Failed to load overview");
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border-2 border-[#F1F5F9] rounded-3xl p-6 shadow-sm">

      {/* Total Investment Value + Total Assets */}
      <div className="flex flex-col w-full md:flex-row items-start md:items-center justify-between">
        <div>
          <p className="text-[18px] md:text-[20px] text-[#62748E] mb-1">Total Investment Value</p>
          <div className="gap-3 mb-4">
            {loading ? (
              <div className="w-48 h-10 bg-gray-100 rounded-xl animate-pulse mt-1" />
            ) : error ? (
              <h2 className="text-[37px] font-bold text-red-400">—</h2>
            ) : (
              <h2 className="text-[37px] md:text-[40px] lg:text-[50px] font-bold">
                {formatCurrency(data?.totalInvestmentValue)}
              </h2>
            )}
          </div>
        </div>

        <div className="bg-[#F0FDF4] py-[3px] px-[16px] flex rounded-full text-[#008236] font-bold text-[16px]">
          {loading
            ? <span className="w-20 h-5 bg-green-100 rounded animate-pulse" />
            : <p>Total Assets: {data?.totalAssets ?? 0}</p>
          }
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="TOTAL LAND SQM"
          value={`${(data?.totalLandSqm ?? 0).toLocaleString()} sqm`}
          dark icon={<LuWallet />} loading={loading}
        />
        <SummaryCard
          title="RENTAL INCOME"
          value={formatCurrency(0)}
          dark icon={<PiBuildingsBold />} loading={false}
        />
        <SummaryCard
          title="AGRO RETURNS"
          value={formatCurrency(0)}
          dark icon={<LuLeaf />} loading={false}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-3">Failed to load data: {error}</p>
      )}
    </div>
  );
}
