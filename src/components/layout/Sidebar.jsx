"use client";
import {
  Squares2X2Icon,
  BriefcaseIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  TableCellsIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import { LuLeaf } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";

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
  const first = user.firstname?.trim() || "";
  const last  = user.lastname?.trim()  || "";
  if (first || last) return `${first} ${last}`.trim();
  if (user.fullName?.trim()) return user.fullName.trim();
  if (user.username?.trim()) return user.username.trim();
  return "User";
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ── Verda Farms Promo Banner ──────────────────────────────────────────────────
function VerdaFarmsBanner() {
  return (
    <div className="mt-4 flex items-center gap-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl px-3 py-3">
      <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
        <LuLeaf className="text-[#00A63E] text-[20px]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#00A63E] uppercase tracking-wide truncate">Verda Farms</p>
      </div>
      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-red-500 text-white flex-shrink-0 whitespace-nowrap">
        Coming Soon
      </span>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => { setUser(getUserFromStorage()); }, []);

  const isAdmin    = pathname.startsWith("/admin");
  const istenant   = pathname.startsWith("/tenant");
  const isInvestor = pathname.startsWith("/dashboard");

  const displayName = getDisplayName(user);
  const role        = user?.role || "—";
  const avatar      = user?.avatar || user?.profileImage || null;

  const getNavItems = () => {
    if (isInvestor) return [
      { label: "Dashboard",  href: "/dashboard",            icon: Squares2X2Icon  },
      { label: "Financials", href: "/dashboard/financials", icon: CreditCardIcon  },
      { label: "Portfolio",  href: "/dashboard/portfolio",  icon: BriefcaseIcon   },
      { label: "Documents",  href: "/dashboard/documents",  icon: DocumentTextIcon },
    ];
    if (istenant) return [
      { label: "Overview",  href: "/tenant",           icon: Squares2X2Icon  },
      { label: "Services",  href: "/tenant/services",  icon: BriefcaseIcon   },
      { label: "Documents", href: "/tenant/documents", icon: DocumentTextIcon },
    ];
    if (isAdmin) return [
      { label: "Overview",         href: "/admin",                  icon: Squares2X2Icon  },
      { label: "Properties",       href: "/admin/property",         icon: CreditCardIcon  },
      { label: "Tenants",          href: "/admin/tenant",           icon: BriefcaseIcon   },
      { label: "Send Credentials", href: "/admin/send-credentials", icon: EnvelopeIcon    },
      { label: "Receipts",         href: "/admin/receipts",         icon: DocumentTextIcon },
      { label: "Data Sheet",       href: "/admin/sheet",            icon: TableCellsIcon  },
    ];
    return [];
  };

  return (
    <aside className="bg-white rounded-3xl py-[37px] px-4 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-2.5">
        <img src="/assets/logo2323-removebg-preview (1).png" className="w-[55%]" alt="" />
      </div>

      {/* MENU */}
      <div className="mb-6">
        <p className="text-xs font-medium text-[#90A1B9] mb-4 tracking-wide">MENU</p>
        <nav className="space-y-2">
          {getNavItems().map((item, index) => (
            <NavItem key={index} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>
      </div>

      {/* Log out */}
      <div className="mt-2.5">
        <nav className="space-y-2">
          <NavItem
            icon={ArrowRightOnRectangleIcon}
            label="Log out"
            onClick={() => {
              localStorage.removeItem("hinansho_auth");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
          />
        </nav>
      </div>

      {/* Verda Farms Banner */}
      <VerdaFarmsBanner />

      {/* User Card */}
      <div className="mt-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {avatar ? (
              <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[13px] font-semibold text-[#DDA04E] uppercase">
                {getInitials(displayName)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{role} Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, icon: Icon, label, active, onClick }) {
  const pathname = usePathname();
  const isActive = active || (href && href !== "#" && pathname === href);
  const commonClass = `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
    isActive ? "bg-linear-to-r from-gray-900 to-gray-800 text-black shadow-lg" : "text-gray-500 hover:bg-gray-100"
  }`;
  if (onClick) {
    return (
      <button onClick={onClick} className={commonClass}>
        <Icon className={`w-5 h-5 ${isActive ? "text-yellow-400" : "text-gray-400"}`} />
        {label}
      </button>
    );
  }
  return (
    <Link href={href} className={commonClass}>
      <Icon className={`w-5 h-5 ${isActive ? "text-yellow-400" : "text-gray-400"}`} />
      {label}
    </Link>
  );
}
