import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: string;
  action?: ReactNode;
  message?: { text: string; tone: "hint" | "error" | "success" } | null;
}

export function FormField({ id, label, icon, action, message, className, ...inputProps }: FormFieldProps) {
  const messageId = message ? `${id}-message` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-bold">
        {label}
      </label>
      <div className="flex h-12 items-center gap-2.5 rounded-md border border-[#e3e5eb] bg-white px-4 focus-within:border-[#235ce8]">
        {icon && <img src={icon} alt="" className="size-4 shrink-0" />}
        <input
          id={id}
          aria-describedby={messageId}
          aria-invalid={message?.tone === "error" || undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9a9fae] disabled:text-[#6a7081]"
          {...inputProps}
        />
        {action}
      </div>
      {message && (
        <p
          id={messageId}
          role={message.tone === "hint" ? undefined : message.tone === "error" ? "alert" : "status"}
          className={cn(
            "mt-1.5 text-xs",
            message.tone === "hint" && "text-[#6a7081]",
            message.tone === "error" && "text-red-600",
            message.tone === "success" && "text-[#235ce8]",
          )}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

export function FieldButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="shrink-0 text-xs font-bold text-[#235ce8] disabled:cursor-not-allowed disabled:text-[#9a9fae]"
      {...props}
    >
      {children}
    </button>
  );
}

export const primaryButtonClass =
  "h-12 w-full rounded-md bg-[#235ce8] text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#9db5f3]";
