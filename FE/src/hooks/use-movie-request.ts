import { useEffect, useState } from "react";
import { getMovieDetailErrorMessage } from "../utils/movies/get-movie-detail-error-message";
export function useMovieRequest<T>(key: string, request: (signal: AbortSignal) => Promise<T>, enabled = true) {
  const [state, setState] = useState<{ key: string; data?: T; error?: string }>({ key: "" });
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    request(controller.signal).then(
      (data) => { if (!controller.signal.aborted) setState({ key, data }); },
      (error: unknown) => { if (!controller.signal.aborted) setState({ key, error: getMovieDetailErrorMessage(error) }); },
    );
    return () => controller.abort();
  }, [key, request, enabled]);
  const current = state.key === key ? state : undefined;
  return { data: enabled ? current?.data : undefined, error: enabled ? current?.error : undefined, loading: enabled && !current };
}
