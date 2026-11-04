interface MovieImageProps { src: string | null; alt: string; className: string }
export function MovieImage({ src, alt, className }: MovieImageProps) {
  return src ? <img src={src} alt={alt} className={className} /> : (
    <div role="img" aria-label={alt + ": 이미지 없음"}
      className={className + " flex items-center justify-center bg-gray-200 text-sm text-gray-600"}>
      이미지 없음
    </div>
  );
}
