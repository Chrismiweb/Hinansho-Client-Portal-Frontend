"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/apiClient";
import Tabs from "./Tabs";
import Overview from "./Overview";
import Financials from "./Financials";
import Expenses from "./Expenses";
import Documents from "./Documents";
import { IoLocationOutline } from "react-icons/io5";

export default function PortfolioDetails() {
  const params   = useParams();
  const router   = useRouter();
  const propName = decodeURIComponent(params?.id || '');

  const [tab, setTab]           = useState("overview");
  const [property, setProperty] = useState(null);
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!propName) return;

    // Fetch sheet data to find this property
    apiRequest("/investor/sheet-overview").then(res => {
      if (res.success) {
        const found = (res.data.properties || []).find(
          p => p.name.toLowerCase() === propName.toLowerCase()
        );
        setProperty(found || null);
      }
    }).finally(() => setLoading(false));

    // Fetch Drive images
    apiRequest(`/investor/drive-property-images?property=${encodeURIComponent(propName)}`)
      .then(res => { if (res.success) setImages(res.images || []); })
      .catch(() => {});
  }, [propName]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DDA04E] border-t-transparent" />
    </div>
  );

  if (!property) return (
    <div className="p-8 text-center text-gray-500">Property not found.</div>
  );

  return (
    <div className="p-4 md:p-8">
      <button onClick={() => router.back()} className="text-sm mb-4 text-[#62748E] hover:text-[#0F172A] transition">
        ← Back to Portfolio
      </button>

      {/* Hero image */}
      {images.length > 0 && (
        <div className="w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-6 bg-[#F1F5F9]">
          <img src={images[0].thumbnailUrl} alt={property.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div>
          <h1 className="text-[26px] md:text-[30px] font-bold text-[#0F172A]">{property.name}</h1>
          {property.date && (
            <p className="text-[#717182] text-[15px] mt-1">
              <IoLocationOutline className="inline mr-1" />
              Purchased: {property.date}
            </p>
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

      {/* Image gallery strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
          {images.map(img => (
            <a key={img.id} href={img.viewLink} target="_blank" rel="noreferrer">
              <img
                src={img.thumbnailUrl}
                alt={img.name}
                className="h-20 w-28 object-cover rounded-xl border-2 border-[#E2E8F0] hover:border-[#DDA04E] transition flex-shrink-0"
              />
            </a>
          ))}
        </div>
      )}

      <Tabs tab={tab} setTab={setTab} />

      {tab === "overview"    && <Overview  data={property} />}
      {/* {tab === "financials"  && <Financials />} */}
      {/* {tab === "expenses"    && <Expenses />} */}
      {tab === "documents"   && <Documents propertyName={property.name} />}
    </div>
  );
}
