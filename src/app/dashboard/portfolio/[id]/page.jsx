"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

// import Tabs from "@/components/Tabs";
// import Overview from "@/components/Overview";
// import Financials from "@/components/Financials";
// import Expenses from "@/components/Expenses";
// import Documents from "@/components/Documents";
import { portfolios } from "@/components/dashboard/portfolio/portfolioData";
import Tabs from "@/components/dashboard/portfolio/Tabs";
import Overview from "@/components/dashboard/portfolio/Overview";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import Financials from "@/components/dashboard/portfolio/Financials";
import Expenses from "@/components/dashboard/portfolio/Expenses";
import Documents from "@/components/dashboard/portfolio/Documents";

export default function PortfolioDetails() {
  const { id } = useParams();
  const router = useRouter();

  const property = portfolios.find(p => p.id === id);

  const [tab, setTab] = useState("overview");

  if (!property) {
    return <div className="p-8">Portfolio not found</div>;
  }

  return (
    <div className="p-8">
      {/* Back button */}
      <Link
        href="/dashboard/portfolio"
        className=" flex items-center mb-4"
      >
        <div className=" text-[18px] flex items-center">
            <div className=""><IoMdArrowBack/> </div> 
            <p>Back to Portfolio</p>
        </div>
      </Link>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-4xl font-bold text-[#0F172B]">
            {property.name}
          </p>
          <p className="text-[#62748E] text-[18px] mt-1.5">
            {property.location} • {property.type}
          </p>
        </div>

        <span className="bg-[#00BBA7] text-white text-[16px] px-4 py-1 rounded-[8px] cursor-pointer">
          Active
        </span>
      </div>

      {/* Tabs */}
      <Tabs tab={tab} setTab={setTab} />

      {/* Tab Content */}
      {tab === "overview" && <Overview data={property} />}
      {tab === "financials" && <Financials />}
      {tab === "expenses" && <Expenses />}
      {tab === "documents" && <Documents />}
    </div>
  );
}
