import Header from "@/components/layout/Header";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#F7F9FB]">
      {/* Sidebar */}
      <aside className="h-auto hidden lg:block pt-[30px] pl-7.5 pr-12.5">
        <Sidebar />
      </aside>

      {/* Main section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
