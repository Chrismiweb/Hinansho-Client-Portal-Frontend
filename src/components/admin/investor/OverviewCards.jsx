"use client";
import { FiDownload } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import SetupInvestorPortalModal from "./SetupInvestorPortalModal";
import { useState } from "react";
import { LuUsers } from "react-icons/lu";
import { LuBuilding2 } from "react-icons/lu";
import { CiMail } from "react-icons/ci";
import { useEffect } from "react";
import axios from "axios";
import { getAuthToken } from "@/lib/authStorage";

export default function OverviewCards() {

    const [open, setOpen] = useState(false);
   const [summary, setSummary] = useState({
     totalInvestors: 0,
     assetsUnderManagement: 0,
     pendingInvites: 0,
   });


  useEffect(() => {
     const fetchSummary = async () => {
       try {
         const token = getAuthToken();
         if (!token) return;

         const res = await axios.get(
           "https://hinansho-client-portal-backend.onrender.com/admin/getInvestors",
           {
             headers: {
               Authorization: `Bearer ${token}`,
             },
           }
         );

         if (res.data?.summary) {
           setSummary(res.data.summary);
         }
       } catch (err) {
         console.error("Error fetching summary:", err);
       }
     };

     fetchSummary();
 }, []);

  return (
    <section className="w-full px-[20px] lg:px-0">
        <div className="flex gap-[10px]">
            <button className="px-[16px] py-[6px] bg-white border-2 text-[#314158] mb-[46px] flex items-center gap-[7px] rounded-[8px] cursor-pointer border-[#E2E8F0] rounded-[8px]">
                <FiDownload className="" /> Export List
            </button>
            <button onClick={() => setOpen(true)}  className="px-[24px] py-[10px] shadow-sm shadow-[#DDA04E] bg-[#DDA04E] text-white mb-[46px] flex items-center gap-[16px] rounded-[8px] cursor-pointer">
                <IoMdAdd className="text-[22px]" /> Add Investor
            </button>
        </div>
        <SetupInvestorPortalModal open={open} onClose={() => setOpen(false)} />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Income */}
      <div className="bg-white rounded-[16px] border-2 border-[#F1F5F9] shadow-sm p-6 flex flex-col gap-[38px]">
        <p className="text-[14px] text-[#62748E]">Total Investors</p>
        <div className="flex items-center gap-[8px]">
            <div className="w-8 h-8 bg-[#F8FAFC] rounded-full flex items-center justify-center">
                <LuUsers className="  text-[#45556C] text-[18px] " />
            </div>
          <p className="text-2xl font-bold">{summary.totalInvestors}</p>
        </div>
      </div>
        <div className="bg-white rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
            <p className="text-[14px] text-[#62748E]">Assets Under Management</p>
            <div className="flex items-center gap-[8px]">
                <div className="w-8 h-8 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                    <LuBuilding2 className="  text-[#155DFC] text-[18px] " />
                </div>
            <p className="text-2xl font-bold">${summary.assetsUnderManagement.toLocaleString()}</p>
            </div>
        </div>
        <div className="bg-white rounded-[16px] border-2 shadow-sm border-[#F1F5F9] p-6 flex flex-col gap-[38px]">
            <p className="text-[14px] text-[#62748E]">Pending Invites</p>
            <div className="flex items-center gap-[8px]">
                <div className="w-8 h-8 bg-[#FEF2F2] rounded-full flex items-center justify-center">
                    <CiMail className="  text-[#E7000B] text-[18px] " />
                </div>
            <p className="text-2xl font-bold">{summary.pendingInvites}</p>
            </div>
        </div>



    </div>
    </section>
  );
}
