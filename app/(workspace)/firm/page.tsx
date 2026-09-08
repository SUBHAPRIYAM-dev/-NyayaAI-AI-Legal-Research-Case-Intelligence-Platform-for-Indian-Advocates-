"use client";

import * as React from "react";
import {
  Users,
  ShieldCheck,
  Plus,
  Mail,
  UserCheck,
  Briefcase,
  Search,
  CheckCircle2,
  Trash2,
  Lock,
  Building,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DEMO_USERS, DEMO_ORGANIZATION } from "@/lib/demo-data";
import { User, UserRole } from "@/types";

export default function FirmWorkspacePage() {
  const [members, setMembers] = React.useState<User[]>(DEMO_USERS);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteName, setInviteName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<UserRole>("Associate");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: User = {
      id: `user-${Date.now()}`,
      name: inviteName || inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      category: inviteRole === "Admin" ? "Law Firm Admin" : "Advocate",
      organizationId: DEMO_ORGANIZATION.id,
      organizationName: DEMO_ORGANIZATION.name,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };

    setMembers([...members, newMember]);
    setShowInviteModal(false);
    setInviteName("");
    setInviteEmail("");
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Building className="h-6 w-6 text-gold-400" />
              {DEMO_ORGANIZATION.name}
            </h1>
            <Badge variant="gold">Chambers RBAC Active</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage law firm partners, associates, permissions, shared research, and multi-tenant matter access.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          className="text-xs"
          onClick={() => setShowInviteModal(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Invite Colleague
        </Button>
      </div>

      {/* Role Hierarchy Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
        {[
          { role: "Owner", desc: "Plenary control & billing", count: 1 },
          { role: "Admin", desc: "Org & user management", count: 1 },
          { role: "Partner", desc: "Senior pleadings sign-off", count: 1 },
          { role: "Associate", desc: "Research, drafting & filings", count: 3 },
          { role: "Researcher", desc: "Authority querying & briefs", count: 1 },
          { role: "Viewer", desc: "Read-only audit client access", count: 1 },
        ].map((r) => (
          <div key={r.role} className="p-3 rounded-lg border border-slate-800 bg-navy-900/60 space-y-1">
            <span className="font-bold text-white block">{r.role}</span>
            <span className="text-[10px] text-slate-400 leading-tight block">{r.desc}</span>
          </div>
        ))}
      </div>

      {/* Members Table Card */}
      <Card className="bg-navy-900/80 border-slate-800 overflow-hidden shadow-xl">
        <CardHeader className="pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Chambers Roster ({members.length})</CardTitle>
            <Badge variant="neutral" className="text-[10px]">
              Tenant ID: {DEMO_ORGANIZATION.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-navy-950/60 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Counsel Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role & Access</th>
                  <th className="py-3 px-4">Practice Focus</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-navy-800 text-gold-400 border border-gold-500/30 flex items-center justify-center font-mono text-xs">
                        {m.name.charAt(0)}
                      </div>
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {m.email}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={m.role === "Admin" ? "unverified" : m.role === "Partner" ? "gold" : "neutral"}
                        className="text-[10px] font-mono"
                      >
                        {m.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400 truncate max-w-[200px]">
                      {m.practiceAreas?.join(", ") || "General Practice"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {m.email !== "demo.advocate@nyayaai.test" ? (
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-mono">Current User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md bg-navy-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Invite Team Member to Chambers</CardTitle>
              <CardDescription>
                Assign role-based access to your firm&apos;s shared litigation repository.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Full Name</label>
                  <Input
                    placeholder="e.g. Adv. Smriti Sen"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Email Address</label>
                  <Input
                    type="email"
                    placeholder="e.g. smriti@lexindica.in"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Chambers Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full h-9 rounded border border-slate-800 bg-navy-950 px-3 text-xs text-white"
                  >
                    <option value="Associate">Associate (Research, drafting, client filings)</option>
                    <option value="Partner">Partner (Review, approval, lead counsel)</option>
                    <option value="Researcher">Researcher (Read & research queries only)</option>
                    <option value="Viewer">Viewer (Read-only case docket)</option>
                    <option value="Admin">Admin (Billing & member management)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Send Invitation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
