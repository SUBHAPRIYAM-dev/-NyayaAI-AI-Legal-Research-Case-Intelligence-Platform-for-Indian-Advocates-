import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-gold-500 text-navy-950 hover:bg-gold-400 font-semibold shadow-sm hover:shadow-gold-500/20",
      secondary:
        "bg-navy-800 text-slate-200 hover:bg-navy-700 border border-slate-700/60 hover:text-white",
      outline:
        "border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500",
      ghost:
        "text-slate-300 hover:bg-white/5 hover:text-white",
      gold:
        "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-navy-950 font-bold hover:brightness-110 shadow-md",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-500 shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
