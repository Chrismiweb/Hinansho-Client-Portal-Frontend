"use client";

import { WrenchScrewdriverIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import PayRentModal from "./PayRentModal";

export default function PaymentOverview() {
    const [open, setOpen] = useState(false);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.8fr_0.9fr] gap-6">
      {/* Left big card */}
      <div className="rounded-[28px] bg-[#1E1E1E] overflow-hidden relative">
        {/* subtle warm gradient on right */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_90%_at_100%_50%,rgba(221,160,78,0.15),transparent_55%)]" />

        <div className="relative p-7 md:p-7 h-full flex flex-col justify-between min-h-[190px]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[14px] md:text-[16px] text-[#90A1B9]">Next Payment Due</p>
              <h2 className="mt-2 text-[35px] mt-[27px] lg:mt-0 md:text-[41px] font-semibold text-white">
                July 1, 2024
              </h2>
            </div>

            <span className="inline-flex items-center  rounded-full bg-[#DDA04E33] px-4 py-1.5 text-[13px] font-bold text-[#DDA04E]">
              Pending
            </span>
          </div>

          <div className="flex items-end justify-between mt-[27px] lg:mt-0">
            <div>
              <p className="text-[16px] text-[#90A1B9]">Total Amount</p>
              <p className="mt-[5px] text-[24px] md:text-[27px] font-bold text-white">
                $850.00
              </p>
            </div>

            <button onClick={() => setOpen(true)} className="rounded-[16px] bg-[#DDA04E] px-[10px]  lg:px-[35px] py-2 md:py-4 text-[14px] md:text-[16px] cursor-pointer font-semibold text-[#0F172B] shadow-sm hover:opacity-95 transition">
              Pay Rent Now
            </button>
          </div>
        </div>
      </div>

      {/* Right action cards */}
      <div className="grid grid-rows-2 gap-6">
        <ActionCard
          icon={<WrenchScrewdriverIcon className="h-5 w-5 text-[#155DFC]" />}
          iconBg="bg-[#EFF6FF]"
          label="Report Issue"
        />
        <ActionCard
          icon={<FiMessageSquare className="h-5 w-5 text-[#9810FA]" />}
          iconBg="bg-[#FAF5FF]"
          label="Chat Admin"
        />
      </div>

       {/* MODAL */}
      <PayRentModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function ActionCard({ icon, iconBg, label }) {
  return (
    <button className="rounded-[28px] bg-white border-[2px] border-[#E6EDF6] shadow-sm px-6 py-7 flex flex-col items-center justify-center gap-4 hover:bg-[#FBFDFF] transition">
      <div className={`h-12 w-12 rounded-full ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <p className="text-[16px] md:text-[20px] lg:text-[16px] font-semibold text-[#314158]">{label}</p>
    </button>
  );
}
