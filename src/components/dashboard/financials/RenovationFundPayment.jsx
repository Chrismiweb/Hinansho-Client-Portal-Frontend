"use client";

import { IoClose } from "react-icons/io5";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { FiClock, FiCalendar } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { CiCircleAlert } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
export default function RenovationFundPayment({ plan, onClose }) {
  return (
    <div className="bg-white rounded-2xl w-full shadow-xl overflow-hidden">
      
      {/* HEADER */}
      <div className="px-6 py-5 flex border border-[#F1F5F9] bg-[#F8FAFC80] justify-between items-start">
        <div className="flex gap-3">
          <div className="p-[10px] bg-white border-[#E2E8F0] rounded-[10px] border">
              <TbBuildingSkyscraper className="text-[#DDA04E] text-[25px]" />
          </div>
          <div>
            <p className="font-semibold text-[14px]">Hinansho Management</p>
            <p className="text-[12px] text-[#62748E]">
              {plan.title}
            </p>
          </div>
        </div>

        <button onClick={onClose}>
          <IoClose size={18} className="text-gray-400" />
        </button>
      </div>


      {/* BODY */}
      <div className="px-6 py-5 space-y-6">

        {/* FINANCIAL OVERVIEW */}
        <div>
          <p className="text-[14px] font-semibold mb-3">
            FINANCIAL OVERVIEW
          </p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-[#F8FAFC] gap-[3px] rounded-[16px] p-[16px]">
              <p className="text-[12px] text-[#90A1B9]">
                Total Committed
              </p>
              <p className="font-semibold text-[18px]">
                $12,000
              </p>
            </div>

            <div className="bg-[#F0FDF4] rounded-[16px] p-4">
              <p className="text-[12px] text-[#00A63E]">
                Paid to Date
              </p>
              <p className="font-semibold text-[18px] text-[#008236]">
                $3,000
              </p>
            </div>
          </div>

          <div className="bg-[#FFFBEB] rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[12px] text-[#E17100]">
                Remaining Balance
              </p>
              <p className="font-semibold text-[18px] text-[#BB4D00]">
                $9,000
              </p>
            </div>

            <button className="bg-[#E17100] text-white shadow-sm text-[12px] px-[12px] py-[5px] rounded-[10px] cursor-pointer font-medium">
              Pay Now
            </button>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#0000001A]"></div>

        {/* PLAN DETAILS */}
        <div>
          <p className="text-[14px] font-semibold mb-[25px]">
            PLAN DETAILS
          </p>

          <div className="flex flex-col gap-[24px] text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#62748E]">
                <FiClock />
                <span>Frequency</span>
              </div>
              <span className="font-medium">Quarterly</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#62748E]">
                <FiCalendar />
                <span>Start Date</span>
              </div>
              <span className="font-medium">Nov 1, 2023</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#62748E]">
                <CiCircleAlert size={20} />
                <span>Status</span>
              </div>
              <span className="bg-[#F0FDF4] text-[#008236] border-2 border-[#B9F8CF] text-xs px-3 py-1 rounded-[8px] font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#0000001A]"></div>

        {/* DOCUMENTS */}
        <div>
          <p className="ttext-[14px] font-semibold mb-[25px]">
            DOCUMENTS
          </p>

          <div className="border border-[#F1F5F9] rounded-[14px] p-4 flex justify-between items-center">
            <div className="flex justify-center items-center gap-[12px]">
                <div className="text-[#62748E] bg-[#F1F5F9] p-[7px] rounded-[10px] text-[20px]"><IoDocumentTextOutline/></div>
                <div>
                    <p className="text-sm font-medium">
                        Renovation Contract
                    </p>
                    <p className="text-xs text-[#64748B]">
                        2024-01-15
                    </p>
                </div>
            </div>

            <FiDownload
              size={20}
              className="text-[#CAD5E2]"
            />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div>
          <p className="text-[14px] font-semibold mb-[25px]">
            RECENT ACTIVITY
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex gap-2 items-start">
              <span className="mt-1 w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Payment Received</p>
                <p className="text-xs text-[#64748B]">
                  May 15, 2024 • $5,000
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <span className="mt-1 w-2 h-2 rounded-full bg-gray-400" />
              <div>
                <p className="font-medium">Invoice Generated</p>
                <p className="text-xs text-[#64748B]">
                  May 1, 2024 • INV-2024-001
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <span className="mt-1 w-2 h-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium">Payment Received</p>
                <p className="text-xs text-[#64748B]">
                  April 15, 2024 • $5,000
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
