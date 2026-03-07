// components/investors/InvestorOverview.jsx

function formatMoney(n) {
  if (!n && n !== 0) return "—";
  return Number(n).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
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

      {/* Units owned */}
      {/* <div className="rounded-[14px] border border-[#E2E8F0] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
          Units Owned
        </p>
        <p className="text-[22px] font-bold text-[#0F172A]">
          {summary?.unitsOwned ?? "—"}
        </p>
      </div> */}

      {/* Recent Activity placeholder */}
      {/* <div className="rounded-[14px] border border-[#E2E8F0] p-4">
        <p className="text-[15px] font-semibold text-[#0F172A] mb-3">Recent Activity</p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-[14px]">🕐</span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#0F172A]">
                  Login detected from new device
                </p>
                <p className="text-[12px] text-[#94A3B8]">
                  Joined {new Date(investor?.joinedAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
