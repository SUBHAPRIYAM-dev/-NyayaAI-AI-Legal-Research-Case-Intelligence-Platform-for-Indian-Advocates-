"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  FolderLock,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Research", href: "/research", icon: Search },
    { label: "Cases", href: "/cases", icon: Briefcase },
    { label: "Documents", href: "/documents", icon: FolderLock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-slate-800 bg-navy-950/95 px-2 backdrop-blur-md md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-medium transition-colors",
              isActive ? "text-gold-400" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-medium text-slate-400 hover:text-slate-200"
      >
        <Menu className="h-4 w-4" />
        <span>More</span>
      </button>
    </nav>
  );
}
