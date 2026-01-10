// pages/PortfolioList.jsx
import React from "react";
import PortfolioCard from "@/components/dashboard/portfolio/PortfolioCard";
import { portfolios } from "@/components/dashboard/portfolio/portfolioData";

export default function PortfolioList() {
  return (
    <div className="p-8">
      <h1 className="text-[30px] font-bold">My Portfolio</h1>
      <p className="text-[#62748E] text-[16px] mb-6">
        Manage and track your real estate investments.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {portfolios.map(p => (
          <PortfolioCard key={p.id} data={p} />
        ))}
      </div>
    </div>
  );
}
