"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  LayoutDashboard,
  Search,
  CheckCircle2,
  FileText,
  Briefcase,
  FolderLock,
  PenTool,
  BookOpen,
  Sparkles,
  Users,
  CreditCard,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

interface AppSidebarProps {
  userRole?: UserRole;
  userName?: string;
  userEmail?: string;
  orgName?: string;
  onLogout?: () => void;
}

export function AppSidebar({
  userRole = "Partner",
  userName = "Adv. Rajesh V. Nariman",
  userEmail = "demo.advocate@nyayaai.test",
  orgName = "Lex Indica Law Chambers",
  onLogout
}: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const mainNavItems = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "AI Legal Research", href: "/research", icon: Search, badge: "Core" },
    { title: "Citation Checker", href: "/citation-checker", icon: CheckCircle2 },
    { title: "Judgment Analyzer", href: "/judgment-analyzer", icon: FileText },
    { title: "Case Management", href: "/cases", icon: Briefcase },
    { title: "Case Strategy", href: "/case-strategy", icon: BrainCircuit },
    { title: "Document Vault", href: "/documents", icon: FolderLock },
    { title: "Legal Drafting", href: "/drafting", icon: PenTool },
    { title: "Authorities & Acts", href: "/authorities", icon: BookOpen },
  ];

  const firmNavItems = [
    { title: "Firm Workspace", href: "/firm", icon: Users },
    { title: "Billing & Plans", href: "/billing", icon: CreditCard },
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  const isAdmin = userRole === "Admin" || userRole === "Owner";

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-800/80 bg-navy-950 text-slate-300 transition-all duration-300 select-none z-30 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Platform Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-md">
              <Scale className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-wider text-white">
                NYAYA<span className="text-gold-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-tight -mt-0.5">
                Indian Legal Intelligence
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-md">
              <Scale className="h-5 w-5 stroke-[2.5]" />
            </div>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded border border-slate-800 bg-navy-900 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        <div>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace & Intelligence
            </div>
          )}
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all group",
                    isActive
                      ? "bg-gold-500/10 text-gold-400 border border-gold-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-gold-400" : "text-slate-400")} />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.title}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-gold-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Firm & Operations
            </div>
          )}
          <nav className="space-y-0.5">
            {firmNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all",
                    isActive
                      ? "bg-gold-500/10 text-gold-400 border border-gold-500/30 shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-gold-400" : "text-slate-400")} />
                  {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                </Link>
              );
            })}

            {/* Admin Console Navigation Item - Only shown for Admin/Owner */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-all text-rose-400 hover:bg-rose-500/10 hover:text-rose-300",
                  pathname?.startsWith("/admin") && "bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold"
                )}
                title={collapsed ? "Admin Portal" : undefined}
              >
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                {!collapsed && <span className="flex-1 truncate">Admin Portal</span>}
                {!collapsed && (
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-rose-300">
                    RBAC
                  </span>
                )}
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-navy-900/60">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-gold-400 border border-gold-500/30 font-semibold text-xs shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">{userName}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gold-400/90 font-mono truncate">{userRole}</span>
                  <span className="text-[9px] text-slate-400 truncate">• {orgName}</span>
                </div>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded transition-colors"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-gold-400 border border-gold-500/30 font-semibold text-xs">
              {userName.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
