"use client";

import { CiClock2 } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { CiCircleCheck } from "react-icons/ci";

const requests = [
  {
    title: "AC Not Cooling",
    meta: "Reported on 2024-06-14 • Pavilion - Unit 304",
    status: "In Progress",
    icon: <CiClock2 className="text-[18px] md:text-[23px] font-bold text-[#155DFC]" />,
    iconBg: "bg-[#DBEAFE]",
  },
  {
    title: "Leaking Faucet",
    meta: "Reported on 2024-06-15 • Pavilion - Unit 201",
    status: "Pending",
    icon: <RiErrorWarningLine className="text-[18px] md:text-[23px] font-bold text-[#F54900]" />,
    iconBg: "bg-[#FFEDD4]",
  },
  {
    title: "Internet Outage",
    meta: "Reported on 2024-06-10 • Pavilion - Common Area",
    status: "Resolved",
    icon: <CiCircleCheck className="text-[18px] md:text-[23px] font-bold text-[#00A63E]" />,
    iconBg: "bg-[#DCFCE7]",
  },
];

export default function MaintenanceRequests() {
  return (
    <section className="rounded-[28px] bg-white border border-[#E6EDF6] shadow-[0_10px_30px_rgba(15,23,42,0.06)] px-[4px] py-6 md:px-0 md:p-6">
      <h3 className="text-[18px] font-semibold px-[20px] lg:px-0 text-[#0A0A0A]">
        Maintenance Requests
      </h3>

      <div className="mt-5 rounded-[20px] p-2 md:p-5 flex flex-col gap-[18px]">
        {requests.map((r) => (
          <div
            key={r.title}
            className="rounded-[18px] bg-[#F8FAFC] border border-white/0 px-2 md:px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`md:h-11 md:w-11 rounded-[16px] ${r.iconBg} flex items-center justify-center`}>
                {r.icon}
              </div>

              <div>
                <p className="text-[16px] md:text-[20px] lg:text-[18px] font-semibold leading-tight">
                  {r.title}
                </p>
                <p className="mt-1 text-[12px] md:text-[18px]  lg:text-[14px] text-[#62748E] max-w-[150px] md:max-w-[520px]">
                  {r.meta}
                </p>
              </div>
            </div>

            <StatusPill status={r.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusPill({ status }) {
  // all pills in the screenshot look like light grey outlines
  return (
    <span className="shrink-0 rounded-full border border-[#E2E8F0] bg-white px-[13px] pt-[5px] pb-[8px] text-[12px] md:text-[18px] lg:text-[13px] font-bold text-[#111827]">
      {status}
    </span>
  );
}