"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { BsTelephone } from "react-icons/bs";
import { getAuthToken } from "@/lib/authStorage";
import InvestorOverview from "./InvestorOverview";
import InvestorProperties from "./InvestorProperties";
import InvestorFinancials from "./InvestorFinancials";
import InvestorDocuments from "./InvestorDocuments";

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "??";
}

const TABS = ["Overview", "Properties", "Documents"];

export default function InvestorDetailsModal({ open, onClose, investorId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Overview");
  const [allProperties, setAllProperties] = useState([]);

useEffect(() => {
  if (!open || !investorId) return;
  setTab("Overview");
  setError("");
  setData(null);

  const fetch_ = async () => {
    try {
      setLoading(true);
      const token = getAuthToken(); // ✅ defined first

      if (!token) throw new Error("Token missing");

      // ✅ Fetch investor data
      const res = await fetch(
        // `https://hinansho-client-portal-backend.onrender.com/admin/Investor/${investorId}`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/Investor/${investorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch investor");
      setData(json);

      // ✅ Fetch all properties — inside fetch_, after token is defined
      const propsRes = await fetch(
        // "https://hinansho-client-portal-backend.onrender.com/admin/fetch-properties",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/fetch-properties`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const propsJson = await propsRes.json();
      if (propsJson.success) setAllProperties(propsJson.properties);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetch_();
}, [open, investorId]);

  if (!open) return null;

  const investor = data?.investor;
  const summary = data?.summary;
  const portfolio = data?.portfolio || [];
  const documents = data?.documents || [];

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-[99%] lg:w-[40%] flex flex-col rounded-[20px] bg-white shadow-2xl overflow-hidden">

          {/* Close button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition"
            >
              <IoClose className="text-[22px]" />
            </button>

            {/* Header */}
            {loading && (
              <div className="px-6 py-8 text-center text-sm text-gray-400">
                <div className="w-7 h-7 border-2 border-[#DDA04E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading...
              </div>
            )}

            {error && (
              <div className="px-6 py-6 text-sm text-red-500">{error}</div>
            )}

            {investor && (
              <div className="px-6 pt-6 pb-4">
                {/* Avatar + name row */}
                <div className="flex items-center gap-4">
                  <div className="w-[64px] h-[64px] rounded-full bg-[#0F172A] flex items-center justify-center text-white text-[20px] font-bold flex-shrink-0">
                    {getInitials(investor.fullName || investor.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-[20px] font-bold text-[#0F172A] truncate">
                        {investor.fullName || "—"}
                      </h2>
                      {/* <button className="text-[13px] px-3 py-1 rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-gray-50 transition flex-shrink-0">
                        Edit Profile
                      </button> */}
                    </div>
                    {/* <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[12px] font-medium px-2.5 py-0.5 rounded-full ring-1 ring-green-200">
                        Active
                      </span>
                      <span className="text-[13px] text-gray-400">
                        • ID: {investor.id?.slice(-7).toUpperCase() || "—"}
                      </span>
                    </div> */}
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-gray-100 flex-wrap">
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <HiOutlineMail className="text-[16px] text-gray-400" />
                    <span className="truncate max-w-[180px]">{investor.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <BsTelephone className="text-[15px] text-gray-400" />
                    <span>{investor.phone || "—"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            {investor && (
              <div className=" flex justify-between items-center border-gray-100 px-6">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`py-3 px-1 mr-6 text-[14px] font-medium border-b-2 transition ${
                      tab === t
                        ? "border-[#DDA04E] text-[#DDA04E]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scrollable tab content */}
          {investor && (
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {tab === "Overview" && <InvestorOverview summary={summary} investor={investor} />}
              {/* {tab === "Properties" && <InvestorProperties portfolio={portfolio} />} */}
              {tab === "Properties" && (
                // <InvestorProperties
                //   portfolio={portfolio}
                //   documents={documents}
                //   investorId={investor?.id}
                // />
                  <>
                  {console.log("investorId passed:", investor?.id)}
                  {console.log("investor object:", investor)}
                  <InvestorProperties
                    portfolio={portfolio}
                    documents={documents}
                    investorId={investor?.id}
                    allProperties={allProperties}
                    onAssign={() => fetch_()} 
                  />
                </>
              )}
              {/* {tab === "Financials" && <InvestorFinancials summary={summary} portfolio={portfolio} />} */}
              {tab === "Documents" && <InvestorDocuments documents={documents} />}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
