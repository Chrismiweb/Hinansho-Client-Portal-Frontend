"use client";

import {
  Squares2X2Icon,
  BriefcaseIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  EnvelopeIcon,
  TableCellsIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// ── Read user from localStorage ─────────────────────────────────────────────
function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("hinansho_auth");
    if (!raw) return null;
    return JSON.parse(raw)?.user || null;
  } catch {
    return null;
  }
}

function getDisplayName(user) {
  if (!user) return "User";
  if (user.fullName?.trim()) return user.fullName.trim();
  if (user.username?.trim()) return user.username.trim();
  if (user.email) {
    const prefix = user.email.split("@")[0].replace(/[._-]/g, " ");
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return "User";
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();
    const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  const isTenant = pathname.startsWith("/tenant");
  const isInvestor = pathname.startsWith("/dashboard");

    const displayName = getDisplayName(user);
    const role        = user?.role || "—";
    const avatar      = user?.avatar || user?.profileImage || null;
    // const settingsBase = isAdmin ? "/admin" : isTenant ? "/tenant" : "/dashboard";

    const handleLogout = () => {
      localStorage.removeItem("hinansho_auth");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      onClose?.();
      window.location.href = "/login";
    };

  const getNavItems = () => {
    if (isInvestor) {
      return [
        { label: "Overview", href: "/dashboard", icon: Squares2X2Icon },
        { label: "Financials", href: "/dashboard/financials", icon: CreditCardIcon },
        { label: "Portfolio", href: "/dashboard/portfolio", icon: BriefcaseIcon },
        // { label: "Messages", href: "/dashboard/messages", icon: ChatBubbleLeftIcon },
        { label: "Documents", href: "/dashboard/documents", icon: DocumentTextIcon },
      ];
    }

    if (isTenant) {
      return [
        { label: "Overview", href: "/tenant", icon: Squares2X2Icon },
        { label: "Services", href: "/tenant/services", icon: BriefcaseIcon },
        { label: "Messages", href: "/tenant/messages", icon: ChatBubbleLeftIcon },
        { label: "Documents", href: "/tenant/documents", icon: DocumentTextIcon },
      ];
    }

    if (isAdmin) {
      return [
      //  { label: "Overview", href: "/admin", icon: Squares2X2Icon },
      //   { label: "Properties", href: "/admin/property", icon: CreditCardIcon },
      //   { label: "Tenants", href: "/admin/tenant", icon: BriefcaseIcon },
      //   { label: "Investors", href: "/admin/investors", icon: DocumentTextIcon },
      //   { label: "Finances", href: "/admin/finance", icon: ChatBubbleLeftIcon },
      //   { label: "Requests", href: "/admin/request", icon: DocumentTextIcon },

        { label: "Overview",    href: "/admin",                icon: Squares2X2Icon  },
        { label: "Properties",  href: "/admin/property",       icon: CreditCardIcon  },
        { label: "Tenants",     href: "/admin/tenant",         icon: BriefcaseIcon   },
        // { label: "Investors",   href: "/admin/investors",      icon: DocumentTextIcon },
        // { label: "Finances",    href: "/admin/finance",        icon: ChatBubbleLeftIcon },
        // { label: "Requests",    href: "/admin/request",        icon: DocumentTextIcon },
        { label: "Send Credentials", href: "/admin/send-credentials", icon: EnvelopeIcon },
        { label: "Receipts", href: "/admin/receipts", icon: DocumentTextIcon },
        { label: "Data Sheet", href: "/admin/sheet",        icon: TableCellsIcon  },

      ];
    }

    return [];
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 flex lg:hidden bg-black/40 z-40 transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <img src="/assets/dashboardLogo.png" alt="logo" className="h-11" />
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Menu */}
        <div className="px-4 py-6">
          <p className="text-xs font-medium text-[#90A1B9] mb-4 tracking-wide">
            MENU
          </p>

          <nav className="space-y-2">
            {getNavItems().map((item, index) => (
              <MobileNavItem
                key={index}
                href={item.href}
                label={item.label}
                icon={item.icon}
                onClick={onClose}
              />
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div className="px-4 mt-auto pb-6">
          {/* <p className="text-xs font-medium text-gray-400 mb-4 tracking-wide">
            SETTINGS
          </p> */}

          <nav className="space-y-2">
            {/* <MobileNavItem
              href="#"
              label="Preferences"
              icon={Cog6ToothIcon}
              onClick={onClose}
            /> */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400" />
              Log out
            </button>
          </nav>
        </div>

                {/* User card — pinned to bottom */}
        <div className="flex-shrink-0 px-4 pb-6 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[13px] font-semibold text-[#DDA04E] uppercase">
                  {getInitials(displayName)}
                </span>
              )}
            </div>

            {/* Name + role */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{role} Account</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------------------- */
/* Mobile Nav Item        */
/* ---------------------- */

function MobileNavItem({ href, icon: Icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm
      text-gray-600 hover:bg-gray-100 transition"
    >
      <Icon className="w-5 h-5 text-gray-400" />
      {label}
    </Link>
  );
}
