import Lenis from "lenis";

let lenis = null;

export const IS_HOME = /^\/(index\.html)?$/.test(window.location.pathname);

export const toSection = (href) => (href.startsWith("#") && !IS_HOME ? `/${href}` : href);

export function startSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  let id = requestAnimationFrame(function raf(time) {
    lenis.raf(time);
    id = requestAnimationFrame(raf);
  });
  return () => {
    cancelAnimationFrame(id);
    lenis.destroy();
    lenis = null;
  };
}

export function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", hash);
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function handleAnchorClick(e) {
  const href = e.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#") || href.length < 2) return;
  e.preventDefault();
  scrollToHash(href);
}
