"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { apiRequest } from "@/lib/apiClient";
import Tabs from "@/components/dashboard/portfolio/Tabs";
import Overview from "@/components/dashboard/portfolio/Overview";
import Financials from "@/components/dashboard/portfolio/Financials";
import Expenses from "@/components/dashboard/portfolio/Expenses";
import Documents from "@/components/dashboard/portfolio/Documents";

export default function PortfolioDetails() {
  const { id } = useParams();
  const propName = decodeURIComponent(id || '');

  const [property, setProperty]       = useState(null);
  const [images, setImages]           = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [tab, setTab]                 = useState("overview");

  useEffect(() => {
    if (!propName) return;

    apiRequest("/investor/sheet-overview")
      .then(res => {
        if (res.success) {
          const found = (res.data.properties || []).find(
            p => p.name.toLowerCase() === propName.toLowerCase()
          );
          if (!found) throw new Error("Property not found");
          setProperty(found);
        } else {
          throw new Error(res.message || "Failed to fetch properties");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    apiRequest(`/investor/drive-property-images?property=${encodeURIComponent(propName)}`)
      .then(res => {
        if (res.success && res.images?.length > 0) {
          setImages(res.images);
          setActiveImage(res.images[0]); // set first image as default
        }
      })
      .catch(() => {});
  }, [propName]);

  if (loading) return (
    <div className="p-8 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#DDA04E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[#64748B] text-[14px]">Loading property details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 min-h-screen">
      <Link href="/dashboard/portfolio" className="flex items-center gap-1 mb-6 text-[#64748B] hover:text-[#0F172A] transition">
        <IoMdArrowBack /><p>Back to Portfolio</p>
      </Link>
      <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-red-600 text-[14px]">{error}</div>
    </div>
  );

  if (!property) return (
    <div className="p-8">
      <Link href="/dashboard/portfolio" className="flex items-center gap-1 mb-6 text-[#64748B]">
        <IoMdArrowBack /><p>Back to Portfolio</p>
      </Link>
      <p className="text-[#64748B]">Property not found.</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 min-h-screen">

      {/* Back button */}
      <Link href="/dashboard/portfolio" className="flex items-center gap-1 mb-4 text-[#64748B] hover:text-[#0F172A] transition">
        <IoMdArrowBack className="text-[18px]" />
        <p className="text-[16px]">Back to Portfolio</p>
      </Link>

      {/* Hero image — changes when thumbnail is clicked */}
      {activeImage && (
        <div className="w-full h-52 md:h-72 rounded-2xl overflow-hidden mb-4 bg-[#F1F5F9]">
          <img
            src={activeImage.thumbnailUrl}
            alt={activeImage.name}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
        <div>
          <p className="text-[25px] md:text-3xl font-bold text-[#0F172B]">{property.name}</p>
          {property.date && (
            <p className="text-[#62748E] text-[15px] mt-1">Purchased: {property.date}</p>
          )}
        </div>
        <span className={`text-[13px] font-bold px-4 py-1.5 rounded-full ${
          property.balance === 0
            ? "bg-[#F0FDF4] text-[#008236]"
            : "bg-[#FFFBEB] text-[#E17100]"
        }`}>
          {property.balance === 0 ? "Fully Paid ✓" : "Active"}
        </span>
      </div>

      {/* Thumbnail strip — click to change hero image */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 mb-5">
          {images.map(img => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img)}
              className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                activeImage?.id === img.id
                  ? "border-[#DDA04E] shadow-md"
                  : "border-[#E2E8F0] hover:border-[#DDA04E]"
              }`}
            >
              <img
                src={img.thumbnailUrl}
                alt={img.name}
                className="h-20 w-28 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs tab={tab} setTab={setTab} />

      {/* Tab content */}
      {tab === "overview"   && <Overview data={property} />}
      {/* {tab === "financials" && <Financials data={property} />} */}
      {/* {tab === "expenses"   && <Expenses data={property} />} */}
      {tab === "documents"  && <Documents propertyName={property.name} />}
    </div>
  );
}
