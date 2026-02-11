"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function Appearance() {
  const [theme, setTheme] = useState("light");

  const themes = [
    {
      id: "light",
      label: "Light",
      selectable: true,
      preview: (
        <div className="h-full w-full rounded-xl bg-gray-50 border border-gray-200 flex">
          <div className="w-10 bg-gray-200 rounded-l-xl" />
          <div className="flex-1" />
        </div>
      ),
    },
    {
      id: "dark",
      label: "Dark (Coming Soon)",
      selectable: false,
      preview: (
        <div className="h-full w-full rounded-xl bg-gray-400 opacity-60 flex">
          <div className="w-10 bg-gray-500 rounded-l-xl" />
          <div className="flex-1" />
        </div>
      ),
    },
    {
      id: "system",
      label: "System",
      selectable: true,
      preview: (
        <div className="h-full w-full rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-2xl">
          🤖
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-[28px] shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Appearance</h2>
      <p className="text-sm text-gray-500 mb-6">
        Customize the look and feel of the application.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {themes.map((item) => {
          const isActive = theme === item.id;

          return (
            <button
              key={item.id}
              disabled={!item.selectable}
              onClick={() => item.selectable && setTheme(item.id)}
              className={`
                relative rounded-2xl p-3 text-left transition
                ${item.selectable ? "cursor-pointer" : "cursor-not-allowed"}
                ${
                  isActive
                    ? "border-2 border-[#1a1f35]"
                    : "border border-gray-200"
                }
              `}
            >
              <div className="h-28 mb-3">{item.preview}</div>

              <p
                className={`text-sm font-medium ${
                  item.selectable ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {item.label}
              </p>

              {isActive && (
                <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-[#1a1f35] flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
