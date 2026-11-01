import { cn } from "../utils/cn";

type ProfileAvatarProps = {
  imageUrl: string | null;
  className?: string;
};

// 프로필 이미지가 없으면 사람 아이콘을 보여줘요.
export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
  return (
    <div className={cn("grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#e8ebf8]", className)}>
      {imageUrl ? (
        <img className="h-full w-full object-cover" src={imageUrl} alt="프로필 이미지" />
      ) : (
        <img className="h-1/2 w-1/2 opacity-60" src="/icons/movie-icons/person.svg" alt="" aria-hidden="true" />
      )}
    </div>
  );
}
