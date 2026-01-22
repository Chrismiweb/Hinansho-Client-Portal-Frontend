"use client";
import { FiUser, FiBell, FiLock } from "react-icons/fi";
import { MdOutlineColorLens } from "react-icons/md";

export default function SettingsNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser className="w-5 h-5" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiBell className="w-5 h-5" />,
    },
    { id: "security", label: "Security", icon: <FiLock className="w-5 h-5" /> },
    {
      id: "appearance",
      label: "Appearance",
      icon: <MdOutlineColorLens className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white rounded-full shadow-md h-16 p-1">
      <div className="flex gap-1 h-full items-center overflow-x-auto px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-6 py-2 rounded-full min-w-[159px] flex items-center justify-center gap-3 text-base font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#0F172B] text-white shadow-lg"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center justify-center">{tab.icon}</div>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
