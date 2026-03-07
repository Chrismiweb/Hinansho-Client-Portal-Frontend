"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { getAuthToken } from "@/lib/authStorage";
import Tabs from "@/components/dashboard/portfolio/Tabs";
import Overview from "@/components/dashboard/portfolio/Overview";
import Financials from "@/components/dashboard/portfolio/Financials";
import Expenses from "@/components/dashboard/portfolio/Expenses";
import Documents from "@/components/dashboard/portfolio/Documents";

export default function PortfolioDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");

useEffect(() => {
  if (!id) return;

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) throw new Error("Token is missing.");

      // ✅ fetch all properties, no id in URL
      const res = await fetch(
        "https://hinansho-client-portal-backend.onrender.com/investor/properties",
        {
          headers: {
            token: token,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to fetch properties");
      }

      // ✅ find the matching property by propertyId
      const found = data.properties.find((p) => p.propertyId === id);

      if (!found) throw new Error("Property not found");

      setProperty(found);
    } catch (err) {
      setError(err.message || "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  fetchProperty();
}, [id]);

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#DDA04E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#64748B] text-[14px]">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen">
        <Link href="/dashboard/portfolio" className="flex items-center gap-1 mb-6 text-[#64748B] hover:text-[#0F172A] transition">
          <IoMdArrowBack />
          <p>Back to Portfolio</p>
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-red-600 text-[14px]">
          {error}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8">
        <Link href="/dashboard/portfolio" className="flex items-center gap-1 mb-6 text-[#64748B]">
          <IoMdArrowBack />
          <p>Back to Portfolio</p>
        </Link>
        <p className="text-[#64748B]">Property not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Back button */}
      <Link
        href="/dashboard/portfolio"
        className="flex items-center gap-1 mb-4 text-[#64748B] hover:text-[#0F172A] transition"
      >
        <IoMdArrowBack className="text-[18px]" />
        <p className="text-[16px]">Back to Portfolio</p>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-[15px] md:gap-0">
        <div>
          <p className="text-[25px] md:text-3xl lg:text-4xl font-bold text-[#0F172B]">
            {property.name}
          </p>
          <p className="text-[#62748E] text-[16px] md:text-[18px] mt-1.5">
            {property.location} • {property.type || property.property_type}
          </p>
        </div>

        <span
          className={`text-white text-[14px] px-4 py-1.5 rounded-[8px] font-medium ${
            property.status?.toLowerCase() === "active"
              ? "bg-[#00BBA7]"
              : property.status?.toLowerCase() === "completed"
              ? "bg-blue-500"
              : "bg-orange-500"
          }`}
        >
          {property.status || "Active"}
        </span>
      </div>

      {/* Tabs */}
      <Tabs tab={tab} setTab={setTab} />

      {/* Tab content — pass full property data to each tab */}
      {tab === "overview" && <Overview data={property} />}
      {tab === "financials" && <Financials data={property} />}
      {tab === "expenses" && <Expenses data={property} />}
      {tab === "documents" && <Documents data={property} />}
    </div>
  );
}
