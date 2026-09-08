import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getVerificationBadgeColor(status: string) {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "PARTIALLY VERIFIED":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "CONFLICTING":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "UNVERIFIED":
    case "POTENTIALLY INCORRECT":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    case "DEMO":
    default:
      return "bg-gold-500/10 text-gold-400 border-gold-500/30";
  }
}
