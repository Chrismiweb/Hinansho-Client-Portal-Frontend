"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { useState } from "react";
import { PiFireSimple } from "react-icons/pi";
import { LiaDumbbellSolid } from "react-icons/lia";
export default function PayRentModal({ open, onClose }) {
  if (!open) return null;
 const utilities = [
    {
      id: 1,
      name: "Wi-Fi Package",
      icon: <FaWifi className="h-5 w-5 text-[#62748E]" />,
      price: "$30/mo",
      checked: false,
      iconBg: "bg-[#F1F5F9]",
    },
    {
      id: 2,
      name: "Cooking Gas",
      icon: <PiFireSimple className="h-5 w-5 text-[#62748E]" />,
      price: "$15/mo",
      checked: false,
      iconBg: "bg-[#F1F5F9]",
    },
    {
      id: 3,
      name: "Gym Membership",
      icon: <LiaDumbbellSolid className="h-5 w-5 text-[#62748E]" />,
      price: "$20/mo",
      checked: false,
      iconBg: "bg-[#F1F5F9]",
    },
  ];

    // State to hold the selected utilities
  const [selectedUtilities, setSelectedUtilities] = useState(
    utilities.reduce((acc, utility) => {
      acc[utility.id] = utility.checked;
      return acc;
    }, {})
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-[520px] rounded-[28px] bg-[#111827] text-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
                <h2 className="text-[20px] font-semibold">Pay Rent</h2>
                <p className="text-sm text-[#90A1B9]">
                Transfer funds to our account and upload the receipt.
                </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-white/10"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 bg-white text-[#0F172A] rounded-b-[28px] px-6 py-6">
            <div className="rounded-[18px] bg-[#F8FAFC] p-5 border border-[#E5EAF1]">
                <div className="flex gap-3 items-center mb-3">
                    <div className="p-[10px] bg-white border-[#E2E8F0] rounded-[10px] border">
                        <TbBuildingSkyscraper className="text-[#DDA04E] text-[25px]" />
                    </div>
                    <div>
                        <p className="font-semibold text-[14px]">Hinansho Management</p>
                        <p className="text-[12px] text-[#62748E]">Official Business Account</p>
                    </div>
                </div>

                <div className="flex flex-col gap-[12px] mt-[16px]">
                    <div className="flex justify-between">
                        <p className="text-[#62748E] text-[12px">Bank</p>
                        <p className="font-semibold text-[14px]">First Bank Of Nigeria</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-[#62748E] text-[12px">Account No.</p>
                        <p className="font-semibold text-[14px]">319-399-0012</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-[#62748E] text-[12px">Total Amount Due</p>
                        <p className="font-semibold text-[14px]">$657</p>
                    </div>
                </div>
            </div>

            {/* Upload */}
            <div className="flex flex-col gap-[8px] mt-[12px]">
                <p className="text-[#314158] text-[14px] font-bold">Upload Receipt</p>
                <label className="border-2 border-[#E2E8F0] gap-[8px] rounded-[14px] p-6 flex flex-col items-center cursor-pointer">
                    <input type="file" hidden />
                    <div className="text-[#90A1B9] bg-[#F8FAFC] p-[10px] text-[30px] rounded-full flex justify-center items-center"><MdOutlineFileUpload/></div>
                    <p className="font-medium text-[14px]">Click to upload receipt</p>
                    <p className="text-[12px] text-[#62748E]">JPG, PNG or PDF (Max 5MB)</p>
                </label>
            </div>

            <div className="">
                <h3 className="text-[14px] mt-[21px] font-semibold text-[#1F2937] mb-4">Add-on Utilities (Optional)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {utilities.map((utility) => (
                    <div
                        key={utility.id}
                        className="flex items-center gap-3 border-[2px] border-[#E2E8F0] p-4 rounded-[14px] cursor-pointer"
                    >
                        <div className={`p-3 ${utility.iconBg} rounded-full`}>
                        {utility.icon}
                        </div>
                        <div>
                        <p className="text-sm font-medium">{utility.name}</p>
                        <p className="text-xs text-gray-500">{utility.price}</p>
                        </div>
                        <input
                        type="checkbox"
                        checked={selectedUtilities[utility.id]}
                        onChange={() => handleCheckboxChange(utility.id)}
                        className="ml-auto rounded-full border-gray-300"
                        />
                    </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-[14px] border border-[#E2E8F0] py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button className="flex-1 rounded-[14px] bg-[#EAC07A] py-3 text-sm font-semibold text-[#111827]">
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
