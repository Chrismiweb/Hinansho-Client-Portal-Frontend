"use client";
const formatCurrency = (n) => {
  if (!n && n !== 0) return "—";
  return `₦${Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Overview({ data }) {
  const progress = data.receivable > 0
    ? Math.min(100, Math.round((data.received / data.receivable) * 100))
    : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 text-[#0A0A0A] gap-6 mt-6">

      {/* Project Status */}
      <div className="bg-white px-[26px] pt-[25px] rounded-xl border pb-[25px] border-[#0000001A] flex flex-col gap-[24px]">
        <p className="text-[18px] font-semibold">Project Status</p>
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-[15px] text-[#62748E]">Payment Progress</p>
            <p className="text-[15px] font-bold">{progress}%</p>
          </div>
          <div className="h-3 bg-slate-100 rounded-full">
            <div className="h-3 bg-slate-900 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-[12px] font-bold text-[#62748E]">STATUS</p>
            <p className="text-[16px] mt-0.5">{data.balance === 0 ? "Fully Paid" : "Active"}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#62748E]">PURCHASE DATE</p>
            <p className="text-[16px] mt-0.5">{data.date || "—"}</p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white px-[26px] pt-[25px] pb-[25px] rounded-xl border border-[#0000001A] flex flex-col gap-[24px]">
        <p className="text-[18px] font-semibold">Investment Details</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[12px] font-bold text-[#62748E]">TOTAL RECEIVABLE</p>
            <p className="text-[18px] font-semibold">{formatCurrency(data.receivable)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#62748E]">AMOUNT PAID</p>
            <p className="text-[18px] font-semibold text-[#00A63E]">{formatCurrency(data.received)}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#62748E]">BALANCE</p>
            <p className={`text-[18px] font-semibold ${data.balance > 0 ? "text-red-500" : "text-[#00A63E]"}`}>
              {data.balance > 0 ? formatCurrency(data.balance) : "Fully Paid ✓"}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#62748E]">SQM OWNED</p>
            <p className="text-[18px] font-semibold">
              {data.sqm ? `${data.sqm.toLocaleString()} sqm` : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
