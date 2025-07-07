// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"; // ✅ 수정된 부분

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
