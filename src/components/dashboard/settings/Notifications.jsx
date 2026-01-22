"use client";

import { useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    monthlyReports: true,
    newDocuments: false,
    maintenanceUpdates: true,
    marketingNews: false,
    directMessages: true,
    paymentAlerts: true,
  });

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const emailNotifications = [
    {
      key: "monthlyReports",
      label: "Monthly Reports",
      description: "Receive monthly financial performance reports.",
    },
    {
      key: "newDocuments",
      label: "New Documents",
      description: "Get notified when new documents are uploaded.",
    },
    {
      key: "maintenanceUpdates",
      label: "Maintenance Updates",
      description: "Alerts about maintenance request status changes.",
    },
    {
      key: "marketingNews",
      label: "Marketing News",
      description: "Receive news about Hinansho features and updates.",
    },
  ];

  const pushNotifications = [
    {
      key: "directMessages",
      label: "Direct Messages",
      description: "Receive messages from tenants or property managers.",
    },
    {
      key: "paymentAlerts",
      label: "Payment Alerts",
      description: "Get notified when rent payments are received.",
    },
  ];

  return (
    <div className="bg-white rounded-[28px] shadow-lg mb-10 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Notification Preferences
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Choose how you want to be notified about activity.
      </p>

      {/* EMAIL NOTIFICATIONS SECTION */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Email Notifications
        </h3>
        <div className="space-y-4">
          {emailNotifications.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {item.label}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                className={`ml-4 relative flex-shrink-0 w-12 h-7 rounded-full transition-colors ${
                  notifications[item.key] ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PUSH NOTIFICATIONS SECTION */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Push Notifications
        </h3>
        <div className="space-y-4">
          {pushNotifications.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {item.label}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() => handleToggle(item.key)}
                className={`ml-4 relative flex-shrink-0 w-12 h-7 rounded-full transition-colors ${
                  notifications[item.key] ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      {/* <div className="flex gap-3 pt-8 border-t border-gray-200">
        <button className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base">
          Cancel
        </button>
        <button className="px-6 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition text-sm sm:text-base">
          Save Preferences
        </button>
      </div> */}
    </div>
  );
}
