export function RequestStatus({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "py-12 text-center text-red-600"
          : "py-12 text-center text-slate-600"
      }
    >
      {message}
    </p>
  );
}
