
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-9 w-9",
  lg: "h-12 w-12",
};

export default function LoadingSpinner({
  size = "md",
  message,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`cinema-spinner ${sizeClasses[size]}`}
      />

      {message ? (
        <p className="text-sm font-medium text-slate-300">
          {message}
        </p>
      ) : (
        <span className="sr-only">로딩 중</span>
      )}
    </div>
  );
}
