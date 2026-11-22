import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { Menu, X, ArrowUpRight, ChevronDown, Route, Users, Mic, BookOpen, PlayCircle } from "lucide-react";
import { EXPLORE_LINKS, PAGE_LINKS } from "../data.js";
import { handleAnchorClick, IS_HOME, toSection } from "../lib/smooth.js";
import { joinProps } from "./ui.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const ICONS = { route: Route, users: Users, mic: Mic, book: BookOpen, play: PlayCircle };
const PATH = window.location.pathname.replace(/\/?$/, "/");
const current = (href) => (href.startsWith("/") && !href.includes("#") && PATH.startsWith(href) ? "page" : undefined);

function ExploreMenu({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const closeTimer = useRef(null);
  const hoverOpenedAt = useRef(0);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hoverOpen = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setOpen((o) => {
      if (!o) hoverOpenedAt.current = Date.now();
      return true;
    });
  };
  const toggle = () => setOpen((o) => (o && Date.now() - hoverOpenedAt.current < 600 ? true : !o));
  const hoverClose = (e) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };

  return (
    <div className="explore" ref={wrapRef} onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
      <button
        ref={btnRef}
        type="button"
        className={`nav-link explore-btn ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
      >
        Explore
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="chev">
          <ChevronDown size={16} aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            className="explore-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul>
              {EXPLORE_LINKS.map((l) => {
                const Icon = ICONS[l.icon];
                return (
                  <li key={l.href}>
                    <a
                      href={toSection(l.href)}
                      onClick={(e) => {
                        setOpen(false);
                        onNavigate(e);
                      }}
                    >
                      <span className="explore-ic" aria-hidden="true">
                        <Icon size={18} />
                      </span>
                      <span className="explore-text">
                        <strong>{l.label}</strong>
                        <span>{l.desc}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev && !open);
  });

  const onLink = (e) => {
    setOpen(false);
    handleAnchorClick(e);
  };

  return (
    <motion.header
      className={`nav ${scrolled || open ? "is-scrolled" : ""}`}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="nav-inner container">
        <a href={IS_HOME ? "#top" : "/"} className="brand" onClick={onLink} aria-label="Unmutex home">
          <img src="/images/logo.png" alt="" width="34" height="38" />
          <span>Unmutex</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          <ExploreMenu onNavigate={handleAnchorClick} />
          {PAGE_LINKS.map((l) => (
            <a key={l.href} className="nav-link" href={l.href} aria-current={current(l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <a href="/book/" className="btn btn-ghost btn-sm hide-sm" aria-current={current("/book/")}>
            Book a call
          </a>
          <a className="btn btn-primary btn-sm" {...joinProps(onLink)}>
            Join <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25 }}
          >
            <p className="mobile-label">Explore</p>
            <div className="mobile-grid">
              {EXPLORE_LINKS.map((l) => {
                const Icon = ICONS[l.icon];
                return (
                  <a key={l.href} href={toSection(l.href)} onClick={onLink}>
                    <Icon size={17} aria-hidden="true" /> {l.label}
                  </a>
                );
              })}
            </div>
            <p className="mobile-label">Pages</p>
            <div className="mobile-grid">
              {[...PAGE_LINKS, { label: "Book a call", href: "/book/" }].map((l) => (
                <a key={l.href} href={l.href} aria-current={current(l.href)} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
