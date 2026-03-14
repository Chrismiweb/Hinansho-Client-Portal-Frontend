"use client";

import { useEffect, useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";
import MobileSidebar from "./MobileSidebar";

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
    return JSON.parse(raw)?.user || null;
  } catch {
    return null;
  }
}

function getFirstName(user) {
  if (!user) return "there";
  const full = user.fullName?.trim() || user.name?.trim();
  if (full) return full.split(" ")[0];
  if (user.username) return user.username;
  if (user.email) return user.email.split("@")[0];
  return "there";
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function HeaderMobile() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setGreeting(getGreeting());
    const user = getUserFromStorage();
    setFirstName(getFirstName(user));
    setAvatar(user?.avatar || user?.profileImage || null);
  }, []);

  const greetingEmoji =
    greeting === "Good morning" ? "☀️" : greeting === "Good afternoon" ? "🌤️" : "🌙";

  return (
    <div className="flex lg:hidden w-full items-center justify-between px-4 md:px-8 py-3 bg-white shadow-md mb-[30px]">
      {/* Left: avatar + greeting */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={firstName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[12px] font-semibold text-[#DDA04E] uppercase">
              {getInitials(firstName)}
            </span>
          )}
        </div>

        {/* Greeting */}
        <div>
          <h1 className="text-[17px] md:text-[20px] font-semibold text-[#0F172B] flex items-center gap-1.5">
            {greeting}, <br/> {firstName}!
          </h1>
          <p className="text-[14px] md:text-sm text-[#62748E]">Welcome Back!</p>
        </div>
      </div>

      {/* Right: notification + menu */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        {/* <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-[#0000001A] shadow-md cursor-pointer flex items-center justify-center">
          <svg
            className="w-4.5 h-4.5 md:w-5 md:h-5 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
            <path d="M9 17a3 3 0 0 0 6 0" />
          </svg>
        </button> */}

        {/* Hamburger */}
        <button
          onClick={() => setOpenSidebar(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          aria-label="Open menu"
        >
          <RiMenu3Fill className="text-[22px] md:text-[26px] text-gray-700" />
        </button>
      </div>

      <MobileSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />
    </div>
  );
}

export default HeaderMobile;
