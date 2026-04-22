import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
