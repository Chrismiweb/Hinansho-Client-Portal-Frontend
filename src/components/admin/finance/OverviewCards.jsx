import { GoArrowUpRight } from "react-icons/go";
import { GoArrowDownLeft } from "react-icons/go";
import { FiDownload } from "react-icons/fi";

export default function OverviewCards() {
  return (
    <section className="w-full px-[20px] lg:px-0">
        <button className="px-[16px] shadow-sm py-[6px] bg-white border-2 text-[#314158] mb-[46px] flex items-center gap-[7px] rounded-[8px] cursor-pointer border-[#E2E8F0] rounded-[8px]">
           <FiDownload className="" /> Export CSV
        </button>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income */}
      <div className="bg-white rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
        <p className="text-[14px] text-[#62748E]">Total Income</p>
        <div className="flex items-center gap-[8px]">
            <div className="w-8 h-8 bg-[#F0FDF4] rounded-full flex items-center justify-center">
                <GoArrowUpRight className="  text-[#00A63E] text-[18px] " />
            </div>
          <p className="text-2xl font-bold">$3,500</p>
        </div>
      </div>
        <div className="bg-white rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
            <p className="text-[14px] text-[#62748E]">Total Expenses</p>
            <div className="flex items-center gap-[8px]">
                <div className="w-8 h-8 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                    <GoArrowDownLeft className="  text-[#E7000B] text-[18px] " />
                </div>
            <p className="text-2xl font-bold">$3,500</p>
            </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
            <p className="text-[14px] text-[#90A1B9]">Net Cash Flow</p>
            <div className="flex items-center gap-[8px]">
                {/* <div className="w-8 h-8 bg-[#F0FDF4] rounded-full flex items-center justify-center">
                    <GoArrowUpRight className="  text-[#00A63E] text-[18px] " />
                </div> */}
            <p className="text-2xl text-[#DDA04E] font-bold">$3,500</p>
            </div>
        </div>

    </div>
    </section>
  );
}
