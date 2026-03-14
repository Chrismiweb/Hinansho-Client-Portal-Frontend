"use client";

import { useEffect, useState } from "react";

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
  // try fullName first, then username, then email prefix
  const full = user.fullName?.trim() || user.name?.trim();
  if (full) return full.split(" ")[0];
  if (user.username) return user.username;
  if (user.email) return user.email.split("@")[0];
  return "there";
}

export default function Header() {
  const [greeting, setGreeting] = useState("Good morning");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setGreeting(getGreeting());
    const user = getUserFromStorage();
    setFirstName(getFirstName(user));
    setAvatar(user?.avatar || user?.profileImage || null);
  }, []);

  return (
    <header className="w-full mt-7.5 hidden lg:flex lg:flex-row items-center justify-between gap-4 mb-6">
      {/* Left: Greeting */}
      <div>
        <h1 className="text-[24px] font-semibold text-[#0F172B] flex items-center gap-2">
          {greeting}, {firstName}!{" "}
          <span>
            {greeting === "Good morning" ? "☀️" : greeting === "Good afternoon" ? "🌤️" : "🌙"}
          </span>
        </h1>
        <p className="text-sm text-[#62748E]">Welcome Back!</p>
      </div>

      {/* Right: Search + Icons */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-100 shadow-md shadow-[#717182] rounded-full bg-white px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Notification */}
        <button className="w-10 h-10 rounded-full bg-white shadow-[#0000001A] shadow-md cursor-pointer flex items-center justify-center">
          <svg
            className="w-5 h-5 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
            <path d="M9 17a3 3 0 0 0 6 0" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            // Fallback: initials circle
            <span className="text-[13px] font-semibold text-[#DDA04E] uppercase">
              {firstName?.slice(0, 2) || "?"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
