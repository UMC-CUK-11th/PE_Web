// 이 파일은 여러 컴포넌트에서 className을 조합할 때 재사용하는 도구다.
// 조건에 따라 클래스를 고르고, 서로 충돌하는 Tailwind 클래스는 마지막 값으로 정리한다.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
