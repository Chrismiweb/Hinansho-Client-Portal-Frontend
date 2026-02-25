"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Users,
  Home,
  Zap,
  Wallet,
  Building,
} from "lucide-react";
import AddPropertyModal from "./AddPropertyModal";

function Overview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState([
    { id: 1, name: "HR1", clients: 140, aum: "NGN17M", priority: "High" },
    {
      id: 2,
      name: "Campus Ville(HR2)",
      clients: 122,
      aum: "NGN30M",
      priority: "Low",
    },
    {
      id: 3,
      name: "Campus Ville(HR3)",
      clients: 458,
      aum: "NGN30M",
      priority: "Medium",
    },
  ]);

  const [transactions] = useState([
    { id: 1, name: "John Doe", details: "HR1, HR2, HR3", amount: "+NGN23M" },
    {
      id: 2,
      name: "John Doe",
      details: "Unit 102 • Rent Payment",
      amount: "+$850.00",
    },
    {
      id: 3,
      name: "John Doe",
      details: "Unit 102 • Rent Payment",
      amount: "+$850.00",
    },
    {
      id: 4,
      name: "John Doe",
      details: "Unit 102 • Rent Payment",
      amount: "+$850.00",
    },
    {
      id: 5,
      name: "John Doe",
      details: "Unit 102 • Rent Payment",
      amount: "+$850.00",
    },
  ]);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100";
      case "medium":
        return "bg-yellow-100";
      case "low":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1> */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-full transition duration-200 flex items-center gap-2"
        >
          Add Property
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* AUM Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg h-45 hover:shadow-md transition duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-600 text-sm font-semibold">A.U.M</span>
            <div className="w-8 h-8 rounded-full flex justify-center items-center bg-[#F0FDF4]">
              <Wallet className="w-4 h-4 text-[#00A63E]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">$45,231.89</p>
          <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            +20.1% from last month
          </div>
        </div>

        {/* Total Clients Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg h-45 hover:shadow-md transition duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-600 text-sm font-semibold">
              Total Clients
            </span>
            <div className="w-8 h-8 rounded-full flex justify-center items-center bg-[#EFF6FF]">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">2,350</p>
          <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            +180 new this month
          </div>
        </div>

        {/* Total Tenants Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg h-45 hover:shadow-md transition duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-600 text-sm font-semibold">
              Total Tenants
            </span>
            <div className="w-8 h-8 rounded-full flex justify-center items-center bg-[#DDA04E1A]">
              <Building className="w-4 h-4 text-[#DDA04E]" />
            </div>
            {/* <Zap className="w-6 h-6 text-orange-500" /> */}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">15</p>
          <div className="flex items-center gap-1 text-teal-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            +2% growth
          </div>
        </div>

        {/* Action Required Card */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg h-45 hover:shadow-xl transition duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-400 text-sm font-semibold">
              Action Required
            </span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">12 Issues</p>
          <p className="text-gray-400 text-sm">Pending maintenance</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            A.U.M Portfolio
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    No of Clients
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    A.U.M per Project
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      {property.name}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {property.clients}
                    </td>
                    <td className="py-4 px-4 text-gray-700 font-semibold">
                      {property.aum}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getPriorityDot(property.priority)}`}
                        ></div>
                        <span className="text-gray-700 text-sm font-medium capitalize">
                          {property.priority}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="text-gray-900 font-semibold hover:text-blue-600 transition duration-200 flex items-center gap-2 group">
              View All Properties
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </button>
          </div> */}
        </div>

        {/* Top Investors */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Top Investors
          </h2>
          <p className="text-gray-500 text-sm mb-6">Latest rent transactions</p>

          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="pb-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-black font-semibold text-sm">JD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm">
                      {transaction.name}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {transaction.details}
                    </p>
                  </div>
                  <p className="text-[#00A63E] font-bold text-sm whitespace-nowrap ml-2">
                    {transaction.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 text-gray-900 font-semibold hover:bg-gray-50 rounded-lg transition duration-200 border border-gray-200">
            View All Transactions
          </button>
        </div>
      </div>

      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Overview;
