"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoLocationOutline } from "react-icons/io5";
import { apiRequest } from "@/lib/apiClient";

const formatCurrency = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
};

const getMeasurement = (name = "", sqm = 0) => {
  if (!sqm) return null;
  const n = name.toLowerCase();
  if (n.includes("pavilion") || n.includes("pavillion"))
    return { label: "Units Owned", value: `${sqm.toLocaleString()} unit${sqm !== 1 ? "s" : ""}` };
  // Verda Farms and everything else → sqm
  return { label: "SQM Owned", value: `${sqm.toLocaleString()} sqm` };
};

export default function PortfolioCard({ data }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    apiRequest(`/investor/drive-property-images?property=${encodeURIComponent(data.name)}`)
      .then(res => {
        if (res.success && res.images?.length > 0) setImgUrl(res.images[0].thumbnailUrl);
      })
      .catch(() => {});
  }, [data.name]);

  const progress    = data.receivable > 0 ? Math.round((data.received / data.receivable) * 100) : 100;
  const isPaid      = data.balance === 0;
  const measurement = getMeasurement(data.name, data.sqm);

  return (
    <div className="bg-white border border-[#0000001A] rounded-2xl overflow-hidden">
      <div className="h-48 w-full bg-[#F1F5F9] relative overflow-hidden">
        {imgUrl ? (
          <img src={imgUrl} className="w-full h-full object-cover" alt={data.name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">🏢</div>
              <p className="text-[12px] text-[#94A3B8]">{data.name}</p>
            </div>
          </div>
        )}
        <span className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full ${
          isPaid ? "bg-[#F0FDF4] text-[#008236]" : "bg-[#FFFBEB] text-[#E17100]"
        }`}>
          {isPaid ? "Paid ✓" : "Active"}
        </span>
      </div>

      <div className="pt-[20px] pb-[17px] px-[20px]">
        <h3 className="text-[20px] text-[#0A0A0A] font-semibold">{data.name}</h3>
        {data.date && (
          <p className="text-[14px] text-[#717182] mt-0.5">
            <IoLocationOutline className="inline mr-1" />
            Purchased: {data.date}
          </p>
        )}

        <div className="mt-4">
          <div className="flex justify-between text-[13px] text-[#62748E] mb-1">
            <span>Payment Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div className={`h-2 rounded-full transition-all ${isPaid ? "bg-[#00C950]" : "bg-[#0F172A]"}`}
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#62748E]">Receivable</span>
            <span className="font-medium">{formatCurrency(data.receivable)}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#62748E]">Paid</span>
            <span className="font-medium text-[#00A63E]">{formatCurrency(data.received)}</span>
          </div>
          {data.balance > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#62748E]">Balance</span>
              <span className="font-medium text-red-500">{formatCurrency(data.balance)}</span>
            </div>
          )}
          {measurement && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#62748E]">{measurement.label}</span>
              <span className="font-medium">{measurement.value}</span>
            </div>
          )}
        </div>

        <Link
          href={`/dashboard/portfolio/${encodeURIComponent(data.name)}`}
          className="mt-5 block w-full bg-slate-900 text-white rounded-xl py-2.5 text-center text-[14px] font-medium hover:bg-slate-800 transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
