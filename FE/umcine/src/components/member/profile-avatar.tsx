interface ProfileAvatarProps {
  src: string | null;
}

export function ProfileAvatar({ src }: ProfileAvatarProps) {
  return (
    <div className="profile-avatar">
      <img
        src={src ?? "/icons/movie-icons/person.svg"}
        alt={src ? "프로필 이미지" : "기본 프로필 이미지"}
        className={src ? "profile-avatar-photo" : "profile-avatar-placeholder"}
      />
    </div>
  );
}
