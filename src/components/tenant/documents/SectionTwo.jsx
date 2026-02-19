"use client";

import { useState } from "react";
import DocumentItem from "./DocumentItem";
import { documentCategories } from "./DocumentCategories";
import { FiSearch } from "react-icons/fi";


const tabs = ["All", "Financial", "Legal", "Tax", "Property"];

export default function SectionTwo() {
  const [activeTab, setActiveTab] = useState("All");

  const allDocuments = Object.values(documentCategories).flat();

  const documents =
    activeTab === "All"
      ? allDocuments
      : documentCategories[activeTab] || [];

  return (

    <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] w-full">
      {/* Tabs + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex gap-2 bg-[#F8FAFC] p-1 rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-full transition ${
                activeTab === tab
                  ? "bg-white shadow font-medium"
                  : "text-[#62748E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

            <div className="relative w-full lg:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
                <input
                    placeholder="Search documents..."
                    className="w-full border border-[#E2E8F0] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none"
                />
            </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <DocumentItem key={doc.id} doc={doc} />
          ))
        ) : (
          <p className="text-center text-gray-400 py-10">
            No documents found.
          </p>
        )}
      </div>
    </div>

  );
}
