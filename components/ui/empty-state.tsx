import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-slate-800 bg-navy-900/40 my-4",
        className
      )}
    >
      <div className="p-3 rounded-full bg-navy-800 text-gold-400 mb-3 border border-slate-700/60 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
