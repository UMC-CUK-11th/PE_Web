import { cn } from "../../utils/cn";

export function ProfileAvatar({ imageUrl, className }: { imageUrl: string | null; className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e3e5eb]", className)}>
      {imageUrl ? (
        <img src={imageUrl} alt="프로필 이미지" className="size-full object-cover" />
      ) : (
        <img src="/icons/user.svg" alt="" className="size-1/2" />
      )}
    </span>
  );
}
