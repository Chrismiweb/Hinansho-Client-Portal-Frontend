// components/dashboard/portfolio/Overview.jsx
export default function Overview({ data }) {
  const roi = data.roi ?? data.expected_roi ?? "—";
  const roiDisplay = roi !== "—" ? `${roi}%` : "—";
  const occupancyDisplay =
    data.occupancy !== undefined ? `${data.occupancy}%` : "—";
  const progressPercent = Math.min(100, Number(data.occupancy) || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 text-[#0A0A0A] gap-6 mt-6">

      {/* Project Status */}
      <div className="bg-white lg:h-[240px] px-[26px] pt-[25px] rounded-xl border pb-[25px] lg:pb-0 border-[#0000001A] flex flex-col gap-[33px]">
        <p className="text-[18px]">Project Status</p>
        <div>
          <div className="flex justify-between">
            <p className="mb-2 text-[16px]">Overall Progress</p>
            <p className="mb-2 text-[16px]">{progressPercent}%</p>
          </div>
          <div className="h-3 bg-slate-200 rounded-full">
            <div
              className="h-3 bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Status + Type row */}
        <div className="flex gap-6">
          <div>
            <p className="text-[13px] font-bold text-[#62748E]">STATUS</p>
            <p className="text-[16px] mt-0.5">{data.status || "—"}</p>
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#62748E]">TYPE</p>
            <p className="text-[16px] mt-0.5">{data.type || data.property_type || "—"}</p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white lg:h-[240px] px-[26px] pt-[25px] pb-[25px] lg:pb-0 rounded-xl border border-[#0000001A] flex flex-col gap-[33px]">
        <p className="text-[18px]">Property Details</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[14px] font-bold text-[#62748E]">TOTAL UNITS</p>
            <p className="text-[20px]">{data.totalUnits ?? "—"}</p>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#62748E]">OCCUPANCY RATE</p>
            <p className="text-[20px]">{occupancyDisplay}</p>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#62748E]">EST. ROI</p>
            <p className="text-[20px] text-[#009689]">{roiDisplay}</p>
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#62748E]">AMOUNT INVESTED</p>
            <p className="text-[20px]">
              {data.amountInvested
                ? `₦${Number(data.amountInvested).toLocaleString()}`
                : "—"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
