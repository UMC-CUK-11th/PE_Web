"use client";

import Image from "next/image";
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
  const backdrop = src.includes("/w1280/");
  return (
    <Image
      src={src}
      alt={alt}
      width={backdrop ? 1280 : 500}
      height={backdrop ? 720 : 750}
      sizes={
        backdrop
          ? "100vw"
          : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
      }
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
