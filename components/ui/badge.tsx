import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "verified" | "unverified" | "warning" | "neutral" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-navy-800 text-slate-300 border-slate-700",
    gold: "bg-gold-500/10 text-gold-400 border-gold-500/30",
    verified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    unverified: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    neutral: "bg-slate-800/80 text-slate-400 border-slate-700/50",
    outline: "border border-slate-700 text-slate-300 bg-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
