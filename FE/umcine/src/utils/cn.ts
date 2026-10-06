import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 조건에 맞는 class를 합치고, 충돌하는 Tailwind class는 뒤의 값을 남긴다.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
