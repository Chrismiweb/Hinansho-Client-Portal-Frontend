// pages/PortfolioDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { portfolios } from "../data/portfolioData";
import Tabs from "../components/Tabs";
import Overview from "../components/Overview";
import Financials from "../components/Financials";
import Expenses from "../components/Expenses";
import Documents from "../components/Documents";
import { useState } from "react";

export default function PortfolioDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = portfolios.find(p => p.id === id);

  const [tab, setTab] = useState("overview");

  return (
    <div className="p-8">
      <button
        onClick={() => navigate("/")}
        className="text-sm mb-4"
      >
        ← Back to Portfolio
      </button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{property.name}</h1>
          <p className="text-slate-500">
            {property.location} • {property.type}
          </p>
        </div>

        <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full">
          Active
        </span>
      </div>

      <Tabs tab={tab} setTab={setTab} />

      {tab === "overview" && <Overview data={property} />}
      {tab === "financials" && <Financials />}
      {tab === "expenses" && <Expenses />}
      {tab === "documents" && <Documents />}
    </div>
  );
}
