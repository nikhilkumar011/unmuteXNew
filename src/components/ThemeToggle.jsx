import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { getTheme, setTheme } from "../lib/theme.js";

export default function ThemeToggle() {
  const [theme, setLocal] = useState(getTheme);

  useEffect(() => {
    const sync = (e) => setLocal(e.detail);
    window.addEventListener("unmutex:theme", sync);
    return () => window.removeEventListener("unmutex:theme", sync);
  }, []);

  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.3, visualDuration: 0.35 }}
          aria-hidden="true"
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
