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

export default function Sidebar() {
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
          <NavItem
            icon={Squares2X2Icon}
            label="Overview"
            active
            href="/dashboard"
          />

          <NavItem icon={BriefcaseIcon} label="Portfolio" href="/dashboard/portfolio" />
          <NavItem icon={CreditCardIcon} label="Financials" href="/dashboard/financials" />
          <NavItem icon={ChatBubbleLeftIcon} label="Messages" href="/dashboard/messages" />
          <NavItem icon={DocumentTextIcon} label="Documents" href="/dashboard/documents" />
        </nav>
      </div>

      {/* SETTINGS */}
      <div className="mt-2.5">
        <p className="text-xs font-medium text-gray-400 mb-4 tracking-wide">
          SETTINGS
        </p>

        <nav className="space-y-2">
          <NavItem icon={Cog6ToothIcon} label="Preferences" href="/dashboard/preferences" />
          <NavItem
            icon={ArrowRightOnRectangleIcon}
            label="Log out"
            href="/logout"
          />
        </nav>
      </div>

      {/* User Card */}
      <div className="mt-7.5">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Alex Johnson
            </p>
            <p className="text-xs text-gray-500">
              Investor Account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------------- */
/* Nav Item Component    */
/* ---------------------- */

// function NavItem({ icon: Icon, label, active, href }) {
//   return (
//     <Link
//       href={href}
//       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
//         ${
//           active
//             ? "bg-linear-to-r from-gray-900 to-gray-800 text-white shadow-lg"
//             : "text-gray-500 hover:bg-gray-100"
//         }`}
//     >
//       <Icon
//         className={`w-5 h-5 ${
//           active ? "text-yellow-400" : "text-gray-400"
//         }`}
//       />
//       {label}
//     </Link>
//   );
// }
function NavItem({ href, icon: Icon, label, active }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
        ${
          active
            ? "bg-linear-to-r from-gray-900 to-gray-800 text-white shadow-lg"
            : "text-gray-500 hover:bg-gray-100"
        }`}
    >
      <Icon
        className={`w-5 h-5 ${
          active ? "text-yellow-400" : "text-gray-400"
        }`}
      />
      {label}
    </Link>
  );
}