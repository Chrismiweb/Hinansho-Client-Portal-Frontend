"use client";
import {
  Squares2X2Icon,
  BriefcaseIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";


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
    // capitalise the email prefix: "chrismibiteso" → "Chrismibiteso"
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


export default function Sidebar() {
  const pathname = usePathname(); // Get current route path
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  // Determine which dashboard user is on
  const isAdmin = pathname.startsWith("/admin");
  const istenant = pathname.startsWith("/tenant");
  const isInvestor = pathname.startsWith("/dashboard");

    const displayName = getDisplayName(user);
  const role = user?.role || "—";
  const avatar = user?.avatar || user?.profileImage || null;


   // Define links based on the dashboard type
  const getNavItems = () => {
    if (isInvestor) {
      return [
        { label: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
        { label: "Financials", href: "/dashboard/financials", icon: CreditCardIcon },
        { label: "Overview", href: "/dashboard/overview", icon: Squares2X2Icon },
        { label: "Portfolio", href: "/dashboard/portfolio", icon: BriefcaseIcon },
        { label: "Documents", href: "/dashboard/documents", icon: DocumentTextIcon },
      ];
    } else if (istenant) {
      return [
        { label: "Overview", href: "/tenant", icon: Squares2X2Icon },
        { label: "Services", href: "/tenant/services", icon: BriefcaseIcon },
        { label: "Documents", href: "/tenant/documents", icon: DocumentTextIcon },
      ];
    } else if (isAdmin) {
      return [
        { label: "Overview", href: "/admin", icon: Squares2X2Icon },
        { label: "Properties", href: "/admin/property", icon: CreditCardIcon },
        { label: "Tenants", href: "/admin/tenant", icon: BriefcaseIcon },
        { label: "Investors", href: "/admin/investors", icon: DocumentTextIcon },
        { label: "Finances", href: "/admin/finance", icon: ChatBubbleLeftIcon },
        { label: "Requests", href: "/admin/request", icon: DocumentTextIcon },


      ];
    }
    return []; // fallback for undefined routes
  };

  // const settingsBase = isAdmin ? "/admin" : isTenant ? "/tenant" : "/dashboard";

  return (
    <aside className="bg-white rounded-3xl py-7.5 px-4 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-2.5">
        <img src="/assets/dashboardLogo.png" alt="" />
      </div>

      {/* MENU */}
      <div className="mb-6">
        <p className="text-xs font-medium text-[#90A1B9] mb-4 tracking-wide">
          MENU
        </p>

        <nav className="space-y-2">
          {/* Active */}
          {/* <NavItem
            icon={Squares2X2Icon}
            label="Overview"
            active
            href="/dashboard"
          />

          <NavItem icon={BriefcaseIcon} label="Portfolio" href="/dashboard/portfolio" />
          <NavItem icon={CreditCardIcon} label="Financials" href="/dashboard/financials" />
          <NavItem icon={ChatBubbleLeftIcon} label="Messages" href="/dashboard/messages" />
          <NavItem icon={DocumentTextIcon} label="Documents" href="/dashboard/documents" /> */}
          {getNavItems().map((item, index) => (
            <NavItem key={index} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
      </div>

      {/* SETTINGS */}
      <div className="mt-2.5">
        <p className="text-xs font-medium text-gray-400 mb-4 tracking-wide">
          SETTINGS
        </p>

        <nav className="space-y-2">
          {/* <NavItem icon={Cog6ToothIcon} label="Settings" href={`${isAdmin ? '/admin' : istenant ? '/tenant' : '/dashboard'}/settings`} /> */}
          <NavItem icon={Cog6ToothIcon} label="Settings" href="#" />

          <NavItem
            icon={ArrowRightOnRectangleIcon}
            label="Log out"
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          />
        </nav>
      </div>

      {/* User Card */}
      <div className="mt-7.5">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
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

          {/* Name + Role */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{role} Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------------- */
/* Nav Item Component    */
/* ---------------------- */
function NavItem({ href, icon: Icon, label, active, onClick }) {
  const commonClass = `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
    active ? "bg-linear-to-r from-gray-900 to-gray-800 text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={commonClass}>
        <Icon className={`w-5 h-5 ${active ? "text-yellow-400" : "text-gray-400"}`} />
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={commonClass}>
      <Icon className={`w-5 h-5 ${active ? "text-yellow-400" : "text-gray-400"}`} />
      {label}
    </Link>
  );
}
