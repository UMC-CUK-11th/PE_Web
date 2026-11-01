import { useState } from "react";
export function MovieImage({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return src && failedSrc !== src
    ? <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailedSrc(src)} />
    : <div role="img" aria-label={alt || "이미지 없음"} className={`flex items-center justify-center bg-slate-200 text-sm text-slate-600 ${className}`}>이미지 없음</div>;
}
