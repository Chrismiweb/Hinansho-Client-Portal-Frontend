// components/investors/InvestorOverview.jsx

function formatMoney(n) {
  if (!n && n !== 0) return "—";
  return Number(n).toLocaleString(undefined, {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });
}

export default function InvestorOverview({ summary, investor }) {
  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[14px] border border-[#E2E8F0] p-4 shadow-sm">
          <p className="text-[12px] uppercase tracking-wider text-[#94A3B8]">
            Total Investment
          </p>
          <p className="text-[24px] font-bold text-[#0F172A] mt-1">
            {formatMoney(summary?.totalInvestment)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#E2E8F0] p-4 shadow-sm">
          <p className="text-[12px] uppercase tracking-wider text-[#94A3B8]">
            Properties Owned
          </p>
          <p className="text-[24px] font-bold text-[#0F172A] mt-1">
            {/* {summary?.propertiesOwned ?? "—"} */}
          {summary?.unitsOwned ?? "—"}

          </p>
        </div>
      </div>
    </div>
  );
}
