import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 조건에 맞는 class를 모으고, 서로 겹치는 Tailwind class를 정리해요.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
