import { useEffect, useState } from "react";
export function useMovieRequest<T>(key: string, load: () => Promise<T>, enabled = true) {
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${key}:${attempt}`;
  const [result, setResult] = useState<{ key: string; data?: T; error?: unknown }>();
  useEffect(() => {
    if (!enabled) return;
    let ignore = false;
    load().then(
      (data) => { if (!ignore) setResult({ key: requestKey, data }); },
      (error: unknown) => { if (!ignore) setResult({ key: requestKey, error }); },
    );
    return () => { ignore = true; };
  }, [requestKey, load, enabled]);
  const current = enabled && result?.key === requestKey ? result : undefined;
  return {
    data: current?.data, error: current?.error,
    isLoading: enabled && !current,
    retry: () => setAttempt((value) => value + 1),
  };
}
