import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header  from "./Header";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed]         = useState(false);

  return (
    // ✅ dark: classes added — bg switches automatically when .dark on <html>
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        collapsed={collapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          collapsed={collapsed}
          onCollapseClick={() => setCollapsed((p) => !p)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6
                         bg-[#f8faf8] dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}