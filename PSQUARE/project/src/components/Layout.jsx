import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  UserPlus,
  Users,
  BarChart3,
  Star,
  LogOut,
} from "lucide-react";
import Navbar from "./Navbar";
import Logout from "../pages/auth/Logout";

const sidebarItems = [
  {
    category: "Recruitment",
    items: [
      {
        name: "Candidates",
        href: "/candidates",
        icon: UserPlus,
      },
    ],
  },
  {
    category: "Organization",
    items: [
      { name: "Employees", href: "/employees", icon: Users },
      { name: "Attendance", href: "/attendance", icon: BarChart3 },
      { name: "Leaves", href: "/leaves", icon: Star },
    ],
  },
  {
    category: "Others",
    items: [{ name: "Logout", href: "/logout", icon: LogOut }],
  },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-[17rem] flex-col bg-white border-r border-purple-500">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 border-2 border-purple-500 rounded"></div>
              <span className="text-purple-600 font-bold text-lg">LOGO</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="relative ml-0" style={{ width: 240, height: 38 }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid #A4A4A4",
                  borderRadius: 50,
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 40,
                  paddingRight: 16,
                  background: "#fff",
                }}
              />
            </div>
          </div>

          <nav className="flex-1 px-4">
            {sidebarItems.map((section) => (
              <div key={section.category} className="mb-6">
                <h3
                  className={`text-xs font-medium text-gray-500 uppercase tracking-wider mb-3${
                    ["Recruitment", "Organization", "Others"].includes(
                      section.category
                    )
                      ? " ml-2"
                      : ""
                  }`}
                >
                  {section.category}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    if (item.name === "Logout") {
                      return (
                        <button
                          key={item.name}
                          type="button"
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md relative w-full text-left ${
                            isActive
                              ? "text-purple-600 bg-purple-50"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setSidebarOpen(false);
                            setShowLogout(true);
                          }}
                        >
                          {isActive && (
                            <div className="absolute left-0 w-2 h-full bg-[#4D007D] rounded-r-[8px]" />
                          )}
                          <Icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-purple-600" : "text-gray-900"
                            }`}
                          />
                          {item.name}
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md relative ${
                          isActive
                            ? "text-purple-600 bg-purple-50"
                            : "text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {isActive && (
                          <div className="absolute left-0 w-2 h-full bg-[#4D007D] rounded-r-[8px]" />
                        )}
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            isActive ? "text-purple-600" : "text-gray-900"
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[17rem] lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 h-screen w-[17rem]">
          {/* Logo */}
          <div className="flex h-20 items-center px-6 mt-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 border-2 border-[#5B1FA6] rounded"></div>
              <span className="text-[#5B1FA6] font-bold text-xl">LOGO</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative ml-4" style={{ width: 240, height: 38 }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid #A4A4A4",
                  borderRadius: 50,
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 40,
                  paddingRight: 16,
                  background: "#fff",
                }}
              />
            </div>
          </div>

          <nav className="flex-1 px-2 flex flex-col">
            <div>
              {sidebarItems
                .filter((section) => section.category !== "Others")
                .map((section, idx) => (
                  <div
                    key={section.category}
                    className={idx === 0 ? "mb-7" : "mb-7 mt-8"}
                  >
                    <h3
                      className={`text-xs font-medium text-gray-400 uppercase tracking-wider mb-3${
                        ["Recruitment", "Organization", "Others"].includes(
                          section.category
                        )
                          ? " ml-2"
                          : ""
                      }`}
                    >
                      {section.category}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md relative transition-colors duration-150 ${
                              isActive
                                ? "text-[#5B1FA6] bg-white font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                            style={isActive ? { boxShadow: "none" } : {}}
                          >
                            {isActive && (
                              <div
                                className="absolute -left-2 top-0 bottom-0 w-2 bg-[#5B1FA6] rounded-r-full"
                                style={{ height: "100%" }}
                              ></div>
                            )}
                            <Icon
                              className={`mr-3 h-5 w-5 ${
                                isActive ? "text-[#5B1FA6]" : "text-gray-600"
                              }`}
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

              <div className="mb-7 mt-8">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 ml-2">
                  Others
                </h3>
                <div className="space-y-1">
                  {sidebarItems
                    .find((section) => section.category === "Others")
                    .items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      if (item.name === "Logout") {
                        return (
                          <button
                            key={item.name}
                            type="button"
                            className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md relative w-full text-left transition-colors duration-150 ${
                              isActive
                                ? "text-[#5B1FA6] bg-white font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                            style={isActive ? { boxShadow: "none" } : {}}
                            onClick={() => setShowLogout(true)}
                          >
                            {isActive && (
                              <div
                                className="absolute left-0 top-0 bottom-0 w-3 bg-[#5B1FA6] rounded-r"
                                style={{ height: "70%" }}
                              ></div>
                            )}
                            <Icon
                              className={`mr-3 h-5 w-5 ${
                                isActive ? "text-[#5B1FA6]" : "text-gray-600"
                              }`}
                            />
                            {item.name}
                          </button>
                        );
                      }
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md relative transition-colors duration-150 ${
                            isActive
                              ? "text-[#5B1FA6] bg-white font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                          style={isActive ? { boxShadow: "none" } : {}}
                        >
                          {isActive && (
                            <div
                              className="absolute left-0 top-0 bottom-0 w-3 bg-[#5B1FA6] rounded-r"
                              style={{ height: "70%" }}
                            ></div>
                          )}
                          <Icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-[#5B1FA6]" : "text-gray-600"
                            }`}
                          />
                          {item.name}
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="lg:pl-64 w-full h-full">
        <div className="w-[98%] mx-auto mt-4">
          <Navbar />
        </div>
        <main className="py-2 w-full h-full">
          <div className="p-0 w-full h-full">{children}</div>
        </main>
      </div>

      {showLogout && <Logout onClose={() => setShowLogout(false)} />}
    </div>
  );
};

export default Layout;
