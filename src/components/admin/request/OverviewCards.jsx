
import { FiDownload } from "react-icons/fi";
import { TiSpannerOutline } from "react-icons/ti";
import { CiClock2 } from "react-icons/ci";
import { PiWarningCircleLight } from "react-icons/pi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
export default function OverviewCards() {
  return (
    <section className="w-full px-[20px] lg:px-0">
        <div className="flex gap-[10px]">
            <button className="px-[16px] py-[6px] bg-white border-2 text-[#314158] mb-[46px] flex items-center gap-[7px] rounded-[8px] cursor-pointer border-[#E2E8F0] rounded-[8px]">
                <FiDownload className="" /> Export CSV
            </button>
            <button className="px-[24px] py-[10px] shadow-sm shadow-[#DDA04E] bg-[#DDA04E] text-white mb-[46px] flex items-center gap-[16px] rounded-[8px] cursor-pointer rounded-full">
                <TiSpannerOutline className="text-[22px]" /> Export CSV
            </button>
        </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Income */}
      <div className="bg-white rounded-[16px] border-2 border-[#F1F5F9] shadow-sm p-6 flex flex-col gap-[38px]">
        <p className="text-[14px] text-[#62748E]">Total Tickets</p>
        <div className="flex items-center gap-[8px]">
            <div className="w-8 h-8 bg-[#F8FAFC] rounded-full flex items-center justify-center">
                <TiSpannerOutline className="  text-[#45556C] text-[18px] " />
            </div>
          <p className="text-2xl font-bold">6</p>
        </div>
      </div>
        <div className="bg-white rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
            <p className="text-[14px] text-[#62748E]">Open Requests</p>
            <div className="flex items-center gap-[8px]">
                <div className="w-8 h-8 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                    <CiClock2 className="  text-[#155DFC] text-[18px] " />
                </div>
            <p className="text-2xl font-bold">3</p>
            </div>
        </div>
        <div className="bg-white rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
            <p className="text-[14px] text-[#62748E]">High Priority</p>
            <div className="flex items-center gap-[8px]">
                <div className="w-8 h-8 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                    <PiWarningCircleLight className="  text-[#E7000B] text-[18px] " />
                </div>
            <p className="text-2xl font-bold">2</p>
            </div>
        </div>
        <div className="bg-white rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
            <p className="text-[14px] text-[#62748E]">Resolved (30d)</p>
            <div className="flex items-center gap-[8px]">
                <div className="w-8 h-8 bg-[#F0FDF4] rounded-full flex items-center justify-center">
                    <IoIosCheckmarkCircleOutline className="  text-[#00A63E] text-[18px] " />
                </div>
            <p className="text-2xl font-bold">14</p>
            </div>
        </div>



    </div>
    </section>
  );
}
