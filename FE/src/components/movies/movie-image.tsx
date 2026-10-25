import { useState } from "react";
export function MovieImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (!src || failedSrc === src) return <div role="img" aria-label={`${alt || "배경"} 이미지 없음`} className={`flex min-h-48 items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-500 ${className}`}>이미지 준비 중</div>;
  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}
