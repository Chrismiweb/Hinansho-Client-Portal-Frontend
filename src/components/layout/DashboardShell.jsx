"use client";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import HeaderMobile from "@/components/layout/HeaderMobile";
import MobileSidebar from "@/components/layout/MobileSidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="min-h-screen flex gap-[5px] lg:pr-0 lg:pl-0 bg-[#F7F9FB]">
      
      {/* Sidebar */}
      <aside className="h-auto hidden lg:block pt-7.5 pl-7.5">
        <Sidebar />
      </aside>

      {/* Main */}
      {/* <div className="flex-1 flex flex-col"> */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto lg:pl-2.5 min-w-0">
        <Header />
        <HeaderMobile />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile sidebar can be mounted globally for mobile interactions */}
      <MobileSidebar />
    </div>
  );
}
