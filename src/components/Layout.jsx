import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const SidebarItem = ({ icon: Icon, label, path, isActive, isCollapsed }) => {
  return (
    <Link
      to={path}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        size={20}
        className={clsx(
          !isActive && "group-hover:scale-110 transition-transform"
        )}
      />
      {!isCollapsed && (
        <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
      {isActive && !isCollapsed && (
        <motion.div
          layoutId="active-pill"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
        />
      )}
    </Link>
  );
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Mobile Overlay with Frosted Glass */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-0 top-0 h-full w-64 bg-card/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden"
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">HC</span>
                  </div>
                  <span className="font-semibold">HCUB Admin</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 hover:bg-accent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              H
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-bold text-lg tracking-tight">HCUB AI</span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto p-1.5 rounded-md hover:bg-accent text-muted-foreground lg:block hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isSidebarOpen}
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
              isCollapsed={!isSidebarOpen && !isMobileMenuOpen}
            />
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <button
            className={clsx(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
              !isSidebarOpen && "justify-center"
            )}
            aria-label="Logout"
          >
            <LogOut size={20} />
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header with Frosted Glass */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-accent/50 border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary text-sm w-64 transition-all"
                aria-label="Search"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"
                aria-label="New notifications"
              ></span>
            </button>
            <div
              className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-medium text-sm ring-2 ring-background shadow-sm cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="User profile"
            >
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
