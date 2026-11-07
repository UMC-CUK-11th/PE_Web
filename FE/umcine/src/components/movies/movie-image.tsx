import { useState } from "react";

export default function MovieImage({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={`${alt || "영화"}: 이미지 없음`}
        className={`flex items-center justify-center bg-zinc-200 text-sm text-zinc-500 ${className ?? ""}`}
      >
        이미지 없음
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
