// src/components/layout/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Database, FileText, Copy, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { name: "Question Bank", path: "/", icon: Database },
    { name: "Saved Papers", path: "/papers", icon: FileText },
    { name: "Templates", path: "/templates", icon: Copy },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
          <GraduationCap className="size-6 text-white" />
        </div>
        <span className="text-xl font-black text-gray-900 tracking-tighter">
          Prep<span className="text-indigo-600">Dart</span>
        </span>
      </Link>

      <nav className="flex items-center gap-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                isActive ? "hover:!text-gray-300 !border-none !bg-gray-600 !text-white" : "!text-gray-500 hover:bg-gray-200"
              )}
            >
              <Icon className="size-4" />
              {link.name}
            </Link>
          );
        })}
        
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 ml-24 hover:bg-gray-200 px-2 py-2 rounded-sm cursor-pointer">
          <LogOut className="size-4" />
          Logout
        </div>
      </nav>
    </header>
  );
}