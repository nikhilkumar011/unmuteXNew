import { useCallback, useEffect, useState } from "react";
import { REVIEW_ADDED } from "./api.js";

export function useReviews() {
  const [state, setState] = useState({ status: "loading", reviews: [] });

  const load = useCallback(async () => {
    setState({ status: "loading", reviews: [] });
    try {
      const res = await fetch("/api/reviews", { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      const { reviews } = await res.json();
      setState({ status: "ready", reviews: Array.isArray(reviews) ? reviews : [] });
    } catch {
      setState({ status: "error", reviews: [] });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onAdded = (e) => {
      const review = e.detail;
      setState((s) => ({ status: "ready", reviews: [review, ...s.reviews.filter((r) => r.id !== review.id)] }));
    };
    window.addEventListener(REVIEW_ADDED, onAdded);
    return () => window.removeEventListener(REVIEW_ADDED, onAdded);
  }, []);

  return { ...state, reload: load };
}
