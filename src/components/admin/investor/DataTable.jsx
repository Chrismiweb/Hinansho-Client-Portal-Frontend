"use client";

import React from "react";

const data = [
  {
    id: 1,
    name: "John Carter",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    joined: "12 Jan 2026",
    location: "New York",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Editor",
    status: "Inactive",
    joined: "03 Feb 2026",
    location: "London",
  },
  {
    id: 3,
    name: "Michael Lee",
    email: "michael@example.com",
    role: "User",
    status: "Active",
    joined: "21 Feb 2026",
    location: "Toronto",
  },
  {
    id: 4,
    name: "Emma Brown",
    email: "emma@example.com",
    role: "Manager",
    status: "Pending",
    joined: "02 Mar 2026",
    location: "Sydney",
  },
];

export default function DataTable() {
  return (
    <div className="w-full">
      {/* Scroll wrapper for mobile */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-[700px] w-full text-sm text-left">
          {/* Header */}
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Location</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.id}</td>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.joined}</td>
                <td className="px-4 py-3">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}