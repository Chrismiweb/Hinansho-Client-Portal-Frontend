"use client";

import { useState } from "react";
import SettingsNav from "./SettingsNav";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Security from "./Security";
import Appearance from "./Appearance";

export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "notifications":
        return <Notifications />;
      case "security":
        return <Security />;
      case "appearance":
        return <Appearance />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="space-y-8">
      <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-8">{renderTabContent()}</div>
    </div>
  );
}
