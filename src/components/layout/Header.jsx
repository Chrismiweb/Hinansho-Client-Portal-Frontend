"use client";

import { useEffect, useState } from "react";
import NotificationBell from "@/components/shared/NotificationBell";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("hinansho_auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user || null;
  } catch {
    return null;
  }
}

function getFirstName(user) {
  if (!user) return "there";
  // ✅ Check firstname field first (how we store it in MongoDB)
  if (user.firstname?.trim()) return user.firstname.trim();
  // Then try fullName or name
  const full = user.fullName?.trim() || user.name?.trim();
  if (full) return full.split(" ")[0];
  // Last resort — username (never email prefix)
  if (user.username) return user.username;
  return "there";
}

export default function Header() {
  const [greeting, setGreeting]   = useState("Good morning");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar]       = useState(null);

  useEffect(() => {
    setGreeting(getGreeting());
    const user = getUserFromStorage();
    setFirstName(getFirstName(user));
    setAvatar(user?.avatar || user?.profileImage || null);
  }, []);

  return (
    <header className="w-full mt-7.5 hidden lg:flex lg:flex-row items-center justify-between gap-4 mb-6">
      {/* Greeting */}
      <div>
        <h1 className="text-[24px] font-semibold text-[#0F172B] flex items-center gap-2">
          {greeting}, {firstName}!{" "}
          <span>
            {greeting === "Good morning" ? "☀️" : greeting === "Good afternoon" ? "🌤️" : "🌙"}
          </span>
        </h1>
        <p className="text-sm text-[#62748E]">Welcome Back!</p>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        {/* <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-100 shadow-md shadow-[#717182] rounded-full bg-white px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div> */}

        <NotificationBell />

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[13px] font-semibold text-[#DDA04E] uppercase">
              {firstName?.slice(0, 2) || "?"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
