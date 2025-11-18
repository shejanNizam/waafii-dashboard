import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Main() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <main className="flex text-start bg-white min-h-screen">
      <section
        role="navigation"
        className={`fixed top-0 left-0 h-screen bg-white z-40 transition-transform duration-300 overflow-hidden ${
          isSidebarOpen
            ? "translate-x-0 w-2/3"
            : "-translate-x-full lg:translate-x-0 w-2/3 lg:w-1/5"
        }`}
      >
        <div className="w-full h-full overflow-y-auto">
          <Sidebar onClose={closeSidebar} />
        </div>
      </section>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <section className="flex-1 flex flex-col min-w-0 lg:ml-[20%]">
        {/* <section className="sticky top-0 w-full p-2 z-20 bg-white shadow-sm"> */}
        <section className="sticky top-0 w-full p-2 z-20 bg-primary md:bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-gray-100 hover:text-black text-white rounded-lg transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <GiHamburgerMenu size={28} />
            </button>
            <Header />
          </div>
        </section>
        {/* outlet */}
        <section className="p-2 flex-1">
          <Outlet />
        </section>
      </section>
    </main>
  );
}
