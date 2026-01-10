// pages/PortfolioList.jsx
import React from "react";
import { portfolios } from "../data/portfolioData";
import PortfolioCard from "../components/PortfolioCard";

export default function PortfolioList() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Portfolio</h1>
      <p className="text-slate-500 mb-6">
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
