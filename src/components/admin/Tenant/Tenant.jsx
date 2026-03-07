"use client";

import React, { useState } from "react";
import {
  Download,
  Users,
  MoreVertical,
  Search,
  ChevronDown,
} from "lucide-react";
import AddTenantModal from "./AddTenantModal";

function Tenant() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tenants = [
    {
      id: 1,
      name: "Sarah Williams",
      email: "sarah@example.com",
      initials: "SW",
      property: "The Pavilion Hostel",
      unit: "Unit 301",
      rentPeriod: { start: "2024-01-15", end: "2025-01-15" },
      rent: "$850/mo",
      status: "Active",
      payment: "Paid",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "mc@example.com",
      initials: "MC",
      property: "Skyline Apartments",
      unit: "Unit 105",
      rentPeriod: { start: "2023-11-01", end: "2025-11-01" },
      rent: "$1,200/mo",
      status: "Active",
      payment: "Late",
    },
    {
      id: 3,
      name: "Jessica Davis",
      email: "jdavis@example.com",
      initials: "JD",
      property: "The Pavilion Hostel",
      unit: "Unit 205",
      rentPeriod: { start: "2024-03-01", end: "2025-02-28" },
      rent: "$850/mo",
      status: "Active",
      payment: "Paid",
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "r.wilson@example.com",
      initials: "RW",
      property: "Grandview Estates",
      unit: "Unit 44",
      rentPeriod: { start: "2022-06-01", end: "2024-06-01" },
      rent: "$2,100/mo",
      status: "Expiring",
      payment: "Paid",
    },
    {
      id: 5,
      name: "Emily Johnson",
      email: "emily.j@example.com",
      initials: "EJ",
      property: "Skyline Apartments",
      unit: "Unit 08A",
      rentPeriod: { start: "2024-02-15", end: "2025-02-14" },
      rent: "$1,150/mo",
      status: "Active",
      payment: "Pending",
    },
    {
      id: 6,
      name: "David Miller",
      email: "d.miller@example.com",
      initials: "DM",
      property: "The Pavilion Hostel",
      unit: "Unit 302",
      rentPeriod: { start: "2023-08-01", end: "2024-07-31" },
      rent: "$825/mo",
      status: "Active",
      payment: "Paid",
    },
    {
      id: 7,
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      initials: "LA",
      property: "Grandview Estates",
      unit: "Unit 12",
      rentPeriod: { start: "2023-05-01", end: "2024-04-30" },
      rent: "$1,850/mo",
      status: "Past",
      payment: "N/A",
    },
  ];

  const stats = [
    { label: "Total Tenants", value: "7", icon: "👥", color: "text-gray-600" },
    { label: "Active Leases", value: "5", icon: "✓", color: "text-green-600" },
    { label: "Late Payments", value: "1", icon: "⚠", color: "text-red-600" },
    {
      label: "Expiring Soon",
      value: "1",
      icon: "⏰",
      color: "text-orange-600",
    },
  ];

  const getPaymentColor = (payment) => {
    switch (payment.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "late":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-orange-600 bg-orange-50";
      case "n/a":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-50";
      case "expiring":
        return "text-orange-600 bg-orange-50";
      case "past":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || tenant.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    console.log("Exporting tenant list...");
    // Add export logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-[28px] hover:bg-gray-50 text-gray-700 font-semibold transition duration-200"
          >
            <Download className="w-5 h-5" />
            Export List
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[#DDA04E] hover:bg-orange-300 text-white rounded-[28px] font-semibold transition duration-200"
          >
            <Users className="w-5 h-5" />
            Add Tenant
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white h-35 rounded-[16px] p-6 shadow-sm hover:shadow-md transition duration-300"
          >
            <span className="text-gray-600 text-sm font-semibold">
              {stat.label}
            </span>
            <div className="flex gap-2 items-start mt-4 ">
              <span className="text-2xl">{stat.icon}</span>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tenant Table Section */}
      <div className="bg-white rounded-[28px] p-6 shadow-lg">
        {/* Search and Filter Bar */}
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
                className="appearance-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer text-gray-700 font-semibold transition duration-200 pr-8"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Tenant
                </th>
                <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Property / Unit
                </th>
                <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Rent Period
                </th>
                <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Rent
                </th>
                <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left py-4 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {tenant.initials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-900 font-semibold text-sm">
                          {tenant.name}
                        </p>
                        <p className="text-gray-500 text-xs truncate">
                          {tenant.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-gray-900 font-medium text-sm">
                        {tenant.property}
                      </p>
                      <p className="text-gray-500 text-xs">{tenant.unit}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-gray-900 font-medium text-sm">
                        {new Date(tenant.rentPeriod.start).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "2-digit", day: "2-digit" },
                        )}
                      </p>
                      <p className="text-gray-500 text-xs">
                        to{" "}
                        {new Date(tenant.rentPeriod.end).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "2-digit", day: "2-digit" },
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-900 font-semibold text-sm">
                      {tenant.rent}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        tenant.status,
                      )}`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                        tenant.payment,
                      )}`}
                    >
                      {tenant.payment}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition duration-200 text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tenants found</p>
          </div>
        )}
      </div>

      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Tenant;
