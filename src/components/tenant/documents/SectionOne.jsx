import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { MdArrowOutward } from "react-icons/md";

export default function SectionOne() {
  return (
    <div className="w-full px-[20px] md:px-0">
      <button className="inline-flex items-center  gap-2 mb-6 bg-[#0F172B] text-white px-5 py-2.5 rounded-full text-[16px]">
        <ArrowDownTrayIcon className="w-4 h-4 " />
        Download All New
      </button>

      <div className="flex lg:flex-row flex-col w-full items-center lg:items-start justify-between gap-4">
        {/* Total Documents */}
        <div className="bg-[#0F172A] text-white w-full lg:w-[32%] rounded-[32px] p-6">
          <div className="w-13 h-13 rounded-[16px] bg-[#FFFFFF1A] flex items-center justify-center mb-4">
            <DocumentTextIcon className="w-6 h-6 text-[#DDA04E]" />
          </div>
          <p className="text-[16px] text-[#90A1B9]">Total Documents</p>
          <h2 className="text-[41px] font-bold mt-2">10</h2>
          <p className="text-[14px] text-[#90A1B9] mt-1">
            Across 3 properties
          </p>
        </div>

        {/* New This Month */}
        <div className="bg-white rounded-[32px] w-full lg:w-[32%] p-6 border border-[#F1F5F9]">
          <div className="w-13 h-13 rounded-[16px] bg-[#F0FDF4] flex items-center justify-center mb-4">
            <MdArrowOutward className="w-6 h-6 text-[#00A63E]" />
          </div>
          <p className="text-[16px] text-[#90A1B9]">New This Month</p>
          <h2 className="text-[41px] font-bold mt-2">3</h2>
          <span className="inline-block mt-2 text-[14px] px-3 py-1 rounded-full bg-[#F0FDF4] text-[#00A63E] font-bold">
            All downloaded
          </span>
        </div>

        {/* Recently Viewed */}
        <div className="bg-white rounded-[32px] w-full lg:w-[32%] p-6 border border-[#F1F5F9]">
          <div className="w-13 h-13 rounded-[16px] bg-[#DDA04E1A] flex items-center justify-center mb-4">
            <EyeIcon className="w-6 h-6 text-[#DDA04E]" />
          </div>
          <p className="text-[16px] text-[#90A1B9]">Recently Viewed</p>
          <h3 className="font-semibold mt-2 truncate text-[20px]">
            Q1 2024 Performance...
          </h3>
          <p className="text-[14px] text-[#90A1B9] mt-3">Just now</p>
        </div>
      </div>
    </div>
  );
}
