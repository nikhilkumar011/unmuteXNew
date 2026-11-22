const KEY = "unmutex-theme";
const META_COLORS = { light: "#ffffff", dark: "#0a0e1c" };

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function setTheme(theme) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) root.classList.add("theme-switching");
  if (theme === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLORS[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable (private mode): the choice lasts for this page only */
  }
  if (!reduce) setTimeout(() => root.classList.remove("theme-switching"), 400);
  window.dispatchEvent(new CustomEvent("unmutex:theme", { detail: theme }));
}
