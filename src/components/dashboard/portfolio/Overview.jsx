// components/Overview.jsx
export default function Overview({ data }) {
  return (
    <div className="grid grid-cols-2 text-[#0A0A0A] gap-6 mt-6">
        <div className="bg-white h-[240px] px-[26px] pt-[25px] rounded-xl border border-[#0000001A] flex flex-col gap-[33px]">
            <p className="text-[18px]">Project Status</p>
            <div>
                <div className="flex justify-between">
                    <p className="mb-2 text-[16px]">Overall Progress</p>
                    <p className="mb-2 text-[16px]">100%</p>
                </div>
                <div className="h-3 bg-slate-200 rounded-full">
                <div className="h-3 w-full bg-slate-900 rounded-full" />
                </div>
            </div>
        </div>

    <div className="bg-white h-[240px] px-[26px] pt-[25px] rounded-xl border border-[#0000001A] flex flex-col gap-[33px]">
      <p className="text-[18px]">Property Details</p>
      <div className=" grid grid-cols-2 gap-4">
        <div>
          <p className="text-[14px] font-bold text-[#62748E]">TOTAL UNITS</p>
          <p className="text-[20px]">{data.totalUnits}</p>
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#62748E]">OCCUPANCY RATE</p>
          <p className="text-[20px]">{data.occupancy}</p>
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#62748E]">EST. ROI</p>
          <p className="text-[20px] text-[#009689]">{data.roi}</p>
        </div>
        <div>
          <p className="text-[14px] font-bold text-[#62748E]">LAST VALUATION</p>
          <p className="text-[20px]">{data.valuation}</p>
        </div>
      </div>
    </div>

    </div>
  );
}
