"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import HeaderMobile from "@/components/layout/HeaderMobile";
import MobileSidebar from "@/components/layout/MobileSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex lg:pr-10 lg:pl-2.5 bg-[#F7F9FB]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block pt-7.5 pl-7.5 pr-12.5">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Header />
        <HeaderMobile />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
