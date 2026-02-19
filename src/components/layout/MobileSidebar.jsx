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
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isTenant = pathname.startsWith("/tenant");
  const isInvestor = pathname.startsWith("/dashboard");

  const getNavItems = () => {
    if (isInvestor) {
      return [
        { label: "Overview", href: "/dashboard", icon: Squares2X2Icon },
        { label: "Portfolio", href: "/dashboard/portfolio", icon: BriefcaseIcon },
        { label: "Financials", href: "/dashboard/financials", icon: CreditCardIcon },
        { label: "Messages", href: "/dashboard/messages", icon: ChatBubbleLeftIcon },
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
        { label: "Overview", href: "/admin", icon: Squares2X2Icon },
        { label: "Properties", href: "/admin/properties", icon: BriefcaseIcon },
        { label: "Tenants", href: "/admin/tenants", icon: CreditCardIcon },
        { label: "Finances", href: "/admin/finance", icon: ChatBubbleLeftIcon },
        { label: "Requests", href: "/admin/request", icon: DocumentTextIcon },
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
          <p className="text-xs font-medium text-gray-400 mb-4 tracking-wide">
            SETTINGS
          </p>

          <nav className="space-y-2">
            <MobileNavItem
              href="/dashboard/preferences"
              label="Preferences"
              icon={Cog6ToothIcon}
              onClick={onClose}
            />
            <MobileNavItem
              href="/logout"
              label="Log out"
              icon={ArrowRightOnRectangleIcon}
              onClick={onClose}
            />
          </nav>
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
