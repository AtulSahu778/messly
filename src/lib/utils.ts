import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const iosFontClass =
  'font-[system-ui,-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",sans-serif] text-foreground';

export const iosInteractiveClass = "transition-transform duration-200 ease-out active:scale-95 active:opacity-70";

export const iosCardClass = `${iosFontClass} bg-card rounded-[28px] p-4`;

export const iosSectionTitleClass = `${iosFontClass} text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground`;

export const iosInsetGroupClass = `${iosFontClass} mx-4 mt-4 rounded-[32px] bg-card p-3 space-y-2`;

export const iosRowClass = `${iosFontClass} flex items-center justify-between py-3`;

export const iosGlassBarClass = `${iosFontClass} bg-panel/80 backdrop-blur-xl border-ios-separator/[0.12]`;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
