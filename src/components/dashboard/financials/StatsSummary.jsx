import { LuWallet } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";

export default function StatsSummary() {
  return (
    <div className="w-[90%] md:w-[95%] flex flex-col lg:w-full md:grid  md:grid-cols-3 lg:gap-6 md:gap-[10px] gap-[30px]">

      {/* Total Outstanding */}
      <div className="bg-[#0F172B] text-white rounded-[32px] p-6">
        <div className="flex flex-col gap-3 mb-3">
        <div className="bg-[#FFFFFF1A] rounded-[16px] items-center flex justify-center p-[12] w-[17%] md:w-[20%]">
            <LuWallet className="text-[25px] text-[#DDA04E]" />
        </div>
          <p className="text-[16px] text-[#90A1B9]">Total Outstanding</p>
        </div>
        <h2 className="text-[30px] lg:text-[35px] font-bold">$24,000.00</h2>
        <p className="text-[16px] md:text-sm text-[#90A1B9] mt-2">
          Across 2 active plans
        </p>
      </div>

      {/* Total Paid */}
      <div className="bg-white rounded-[32px] p-6 border-2 border-[#F1F5F9]">
        <div className="flex flex-col gap-3 mb-3">
          <div className="bg-[#F0FDF4] rounded-[16px] items-center flex justify-center p-[12] w-[20%]">
            <CiCircleCheck className="text-[25px] font-bold text-[#00A63E]" />
          </div>
          <p className="text-[16px] text-[#90A1B9]">Total Paid</p>
        </div>

        <h2 className="text-[35px] font-bold">$38,000.00</h2>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#00C950] h-2 rounded-full w-[61%]" />
          </div>
          <p className="text-[16px] md:text-sm text-[#90A1B9] mt-2">
            61% of total commitments
          </p>
        </div>
      </div>

      {/* Next Payment */}
      <div className="bg-white rounded-[32px] p-6 border-2 border-[#F1F5F9]">
        <div className="flex flex-col gap-3 mb-3">
          <div className="bg-[#FFFBEB] rounded-[16px] items-center flex justify-center p-[12] w-[20%]">
            <CiCalendar className="text-[25px] font-bold text-[#E17100]" />
           </div>
          <p className="text-[16px] text-[#90A1B9]">Next Payment Due</p>
        </div>

        <h2 className="text-[35px] font-bold">$5,000.00</h2>

        <span className="inline-block mt-3 text-[16px] md:text-sm font-bold bg-[#FFFBEB] text-[#E17100] px-3 py-1 rounded-full">
          Due in 8 days (May 15)
        </span>
      </div>
    </div>
  );
}
