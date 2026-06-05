"use client";
import { useEffect, useState } from "react";
import PortfolioCard from "./PortfolioCard";
import { apiRequest } from "@/lib/apiClient";

export default function PortfolioList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    apiRequest("/investor/sheet-overview")
      .then(res => {
        if (res.success) setProperties(res.data.properties || []);
        else throw new Error(res.message);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#DDA04E] border-t-transparent" />
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-sm text-red-600">Failed to load: {error}</div>
  );

  if (properties.length === 0) return (
    <div className="text-center py-10 text-sm text-gray-500">No properties found.</div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5">
      {properties.map((property, idx) => (
        <PortfolioCard key={idx} data={property} />
      ))}
    </div>
  );
}
