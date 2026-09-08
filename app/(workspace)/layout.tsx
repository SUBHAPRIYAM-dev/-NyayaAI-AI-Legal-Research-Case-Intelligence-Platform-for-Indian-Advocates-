"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { MobileNav } from "@/components/layout/MobileNav";
import { User, UserRole } from "@/types";
import { DEMO_USERS } from "@/lib/demo-data";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User>(DEMO_USERS[0]); // Default to Advocate
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  // Sync user from localStorage or API if available
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("nyayaai_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
        }
      }
    } catch {
      // Fallback to default demo advocate
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("nyayaai_user");
      document.cookie = "nyayaai_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    } catch {}
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-navy-950 text-slate-100">
      {/* Sidebar Navigation (Desktop/Tablet) */}
      <AppSidebar
        userRole={currentUser.role}
        userName={currentUser.name}
        userEmail={currentUser.email}
        orgName={currentUser.organizationName}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          queriesUsed={142}
          queriesLimit={2000}
          isRealGemini={false}
        />

        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav onOpenMenu={() => setCommandPaletteOpen(true)} />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
