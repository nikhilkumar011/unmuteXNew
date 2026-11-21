import { useScroll, useTransform } from "motion/react";

export function useProgress(options) {
  const { scrollYProgress } = useScroll(options);
  return useTransform(() => scrollYProgress.get());
}
