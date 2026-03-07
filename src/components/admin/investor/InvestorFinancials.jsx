// components/investors/InvestorFinancials.jsx

function formatMoney(n) {
  if (!n && n !== 0) return "—";
  return Number(n).toLocaleString(undefined, {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  });
}

export default function InvestorFinancials({ summary, portfolio }) {
  const totalPaid = portfolio?.reduce((acc, p) => acc + (p.amountPaid || 0), 0) || 0;

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[14px] border border-[#E2E8F0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Total Invested
          </p>
          <p className="text-[22px] font-bold text-[#0F172A] mt-1">
            {formatMoney(summary?.totalInvestment)}
          </p>
        </div>
        <div className="rounded-[14px] border border-[#E2E8F0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Units Owned
          </p>
          <p className="text-[22px] font-bold text-[#0F172A] mt-1">
            {summary?.unitsOwned ?? "—"}
          </p>
        </div>
      </div>

      {/* Transaction history */}
      <div className="rounded-[14px] border border-[#E2E8F0] p-4">
        <p className="text-[14px] font-semibold text-[#0F172A] mb-3">Transaction History</p>
        {portfolio?.length > 0 ? (
          <div className="space-y-3">
            {portfolio.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-[#0F172A]">Property Investment</p>
                  <p className="text-[12px] text-[#94A3B8]">
                    {item.assignedDate
                      ? new Date(item.assignedDate).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <p className="text-[14px] font-bold text-green-600">
                  +{formatMoney(item.amountPaid)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#94A3B8]">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
