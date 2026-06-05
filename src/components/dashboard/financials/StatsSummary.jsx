"use client";

import { useEffect, useState } from "react";
import { LuWallet } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";
import { apiRequest } from "@/lib/apiClient";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₦0.00";
  return `₦${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function StatsSummary() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    apiRequest("/investor/sheet-overview")
      .then(res => {
        if (res.success) setData(res.data);
        else throw new Error(res.message);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalOutstanding  = data?.totalBalance          || 0;
  const totalPaid         = data?.totalReceived          || 0;
  const totalReceivable   = data?.totalInvestmentValue   || 0;
  const activePlans       = data?.properties?.filter(p => p.balance > 0).length || 0;
  const paidPercent       = totalReceivable > 0
    ? Math.round((totalPaid / totalReceivable) * 100)
    : 0;

  if (loading) {
    return (
      <div className="w-[90%] md:w-[95%] flex flex-col lg:w-full md:grid md:grid-cols-2 lg:gap-6 md:gap-[10px] gap-[30px]">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-[32px] p-6 border-2 border-[#F1F5F9] animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-4" />
            <div className="h-4 bg-gray-100 rounded w-32 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-40" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-[90%] md:w-[95%] flex flex-col lg:w-full md:grid md:grid-cols-2 lg:gap-6 md:gap-[10px] gap-[30px]">

      {/* Total Outstanding */}
      <div className="bg-[#0F172B] text-white rounded-[32px] p-6">
        <div className="flex flex-col gap-3 mb-3">
          <div className="bg-[#FFFFFF1A] rounded-[16px] items-center flex justify-center p-[12px] w-[17%] md:w-[20%]">
            <LuWallet className="text-[25px] text-[#DDA04E]" />
          </div>
          <p className="text-[16px] text-[#90A1B9]">Total Outstanding</p>
        </div>
        <h2 className="text-[30px] lg:text-[35px] font-bold">
          {formatCurrency(totalOutstanding)}
        </h2>
        <p className="text-[16px] md:text-sm text-[#90A1B9] mt-2">
          {activePlans > 0
            ? `Across ${activePlans} active plan${activePlans !== 1 ? "s" : ""}`
            : "All payments complete ✓"}
        </p>
      </div>

      {/* Total Paid */}
      <div className="bg-white rounded-[32px] p-6 border-2 border-[#F1F5F9]">
        <div className="flex flex-col gap-3 mb-3">
          <div className="bg-[#F0FDF4] rounded-[16px] items-center flex justify-center p-[12px] w-[20%]">
            <CiCircleCheck className="text-[25px] font-bold text-[#00A63E]" />
          </div>
          <p className="text-[16px] text-[#90A1B9]">Total Paid</p>
        </div>
        <h2 className="text-[35px] font-bold">{formatCurrency(totalPaid)}</h2>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00C950] h-2 rounded-full transition-all duration-700"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
          <p className="text-[16px] md:text-sm text-[#90A1B9] mt-2">
            {paidPercent}% of total commitments
          </p>
        </div>
      </div>


      {error && (
        <p className="text-xs text-red-400 col-span-3 text-center">Failed to load: {error}</p>
      )}
    </div>
  );
}
