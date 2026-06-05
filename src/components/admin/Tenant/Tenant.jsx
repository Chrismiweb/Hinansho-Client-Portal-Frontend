"use client";

import React, { useState } from "react";
import { Download, Users, MoreVertical, Search, ChevronDown } from "lucide-react";
import AddTenantModal from "./AddTenantModal";

function Tenant() {
  const [searchTerm, setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tenants = []; // No tenants yet

  const stats = [
    { label: "Total Tenants",  value: "0", icon: "👥", color: "text-gray-600"   },
    { label: "Active Leases",  value: "0", icon: "✓",  color: "text-green-600"  },
    { label: "Late Payments",  value: "0", icon: "⚠",  color: "text-red-600"    },
    { label: "Expiring Soon",  value: "0", icon: "⏰", color: "text-orange-600" },
  ];

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || tenant.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-[28px] hover:bg-gray-50 text-gray-700 font-semibold transition duration-200">
            <Download className="w-5 h-5" />
            Export List
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[#DDA04E] hover:bg-orange-400 text-white rounded-[28px] font-semibold transition duration-200"
          >
            <Users className="w-5 h-5" />
            Add Tenant
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white h-35 rounded-[16px] p-6 shadow-sm hover:shadow-md transition duration-300">
            <span className="text-gray-600 text-sm font-semibold">{stat.label}</span>
            <div className="flex gap-2 items-start mt-4">
              <span className="text-2xl">{stat.icon}</span>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tenant Table Section */}
      <div className="bg-white rounded-[28px] p-6 shadow-lg">

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm font-semibold">Status:</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none pr-8 text-gray-700 font-semibold"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Expiring">Expiring</option>
                <option value="Past">Past</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table headers */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["Tenant", "Property / Unit", "Rent Period", "Rent", "Status", "Payment", "Action"].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">{tenant.initials}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{tenant.name}</p>
                        <p className="text-gray-500 text-xs">{tenant.email}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredTenants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-1">No Tenants Yet</p>
            <p className="text-gray-400 text-sm max-w-xs">
              Tenant records will appear here once they have been added to the system.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white rounded-full text-sm font-medium hover:bg-[#1E293B] transition"
            >
              <Users className="w-4 h-4" />
              Add First Tenant
            </button>
          </div>
        )}
      </div>

      <AddTenantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Tenant;
