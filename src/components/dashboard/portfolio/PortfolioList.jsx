"use client";
import { useEffect, useState } from "react";
import PortfolioCard from "./PortfolioCard";  // Assuming PortfolioCard is in the same folder
import { getAuthToken } from "@/lib/authStorage";

export default function PortfolioList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const token = getAuthToken(); // ✅ add auth
      const res = await fetch(
        "https://hinansho-client-portal-backend.onrender.com/investor/properties",
        {
          headers: {
            token: token, // ✅ match your API's header key
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      } else {
        throw new Error(data.message || "Failed to fetch properties");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchProperties();
}, []);

  if (loading) return <div>Loading...</div>;  // Show loading while fetching data
  if (error) return <div>Error: {error}</div>;  // Show error message if fetch fails

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PortfolioCard key={property.propertyId} data={property} />
      ))}
    </div>
  );
}