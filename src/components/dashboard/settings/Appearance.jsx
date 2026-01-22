"use client";

import { useState } from "react";

export default function Appearance() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [compactMode, setCompactMode] = useState(false);

  const themes = [
    {
      id: "light",
      label: "Light",
      description: "Clean and bright interface",
      preview: "bg-white border-2",
    },
    {
      id: "dark",
      label: "Dark",
      description: "Easy on the eyes",
      preview: "bg-gray-900 border-2",
    },
    {
      id: "system",
      label: "System",
      description: "Follows system settings",
      preview: "bg-gradient-to-r from-white to-gray-900 border-2",
    },
  ];

  const fontSizes = [
    { id: "small", label: "Small", size: "text-sm" },
    { id: "medium", label: "Medium", size: "text-base" },
    { id: "large", label: "Large", size: "text-lg" },
  ];

  return (
    <div className="bg-white rounded-[28px] shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Appearance </h2>

      {/* Theme Selection */}
      <div className="mb-8 pb-8  border-gray-200">
        <p className="text-gray-600 text-sm mb-6">
         Customize the look and feel of the application.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`p-4 rounded-lg border-2 transition ${
                theme === themeOption.id
                  ? "border-[#1a1f35] ring-2 ring-[#1a1f35] ring-opacity-20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className={`w-full h-24 rounded-lg mb-3 ${themeOption.preview}`} />
              <h4 className="font-semibold text-gray-900">{themeOption.label}</h4>
              <p className="text-xs text-gray-600">{themeOption.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
