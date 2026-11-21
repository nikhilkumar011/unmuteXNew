import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useTransform } from "motion/react";
import { useProgress } from "../lib/useProgress.js";
import { Play, X, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data.js";
import { EASE, Eyebrow, Reveal, SplitWords } from "./ui.jsx";
import { useMediaQuery } from "../lib/useMediaQuery.js";
import { lockScroll } from "../lib/smooth.js";

function VideoCard({ t, onOpen, i }) {
  const [hover, setHover] = useState(false);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  return (
    <motion.button
      type="button"
      className="vcard"
      onClick={() => onOpen(i)}
      onPointerEnter={() => canHover && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => canHover && setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={`Play ${t.name}'s story`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={t.poster} alt="" loading="lazy" />
      {hover && (
        <video className="vcard-preview" src={t.preview} muted autoPlay loop playsInline preload="none" />
      )}
      <span className="vcard-shade" />
      <span className="vcard-play">
        <Play size={20} fill="currentColor" />
      </span>
      <span className="vcard-meta">
        <strong>{t.name}</strong>
        <span>Unmutex member</span>
      </span>
    </motion.button>
  );
}

function Column({ items, offset, y, onOpen }) {
  return (
    <motion.div className="vcol" style={{ y }}>
      {items.map((t, j) => (
        <VideoCard key={t.id} t={t} i={offset + j} onOpen={onOpen} />
      ))}
    </motion.div>
  );
}

function Player({ index, onClose, onStep }) {
  const t = TESTIMONIALS[index];
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    lockScroll(true);
    return () => {
      lockScroll(false);
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  return (
    <motion.div
      className="player"
      role="dialog"
      aria-modal="true"
      aria-label={`${t.name}'s video testimonial`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button ref={closeRef} className="player-close" onClick={onClose} aria-label="Close video">
        <X size={22} />
      </button>
      <button className="player-nav prev" onClick={() => onStep(-1)} aria-label="Previous story">
        <ChevronLeft size={26} />
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={t.id}
          className="player-frame"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
          transition={{ type: "spring", bounce: 0.2, visualDuration: 0.4 }}
        >
          <video src={t.video} poster={t.poster} controls autoPlay playsInline />
          <span className="player-name">
            {t.name} <span>· {index + 1} of {TESTIMONIALS.length}</span>
          </span>
        </motion.div>
      </AnimatePresence>
      <button className="player-nav next" onClick={() => onStep(1)} aria-label="Next story">
        <ChevronRight size={26} />
      </button>
    </motion.div>
  );
}

export default function VideoTestimonials() {
  const ref = useRef(null);
  const desktop = useMediaQuery("(min-width: 900px)");
  const [open, setOpen] = useState(null);
  const scrollYProgress = useProgress({ target: ref, offset: ["start end", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], desktop ? [80, -160] : [0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 1], desktop ? [-60, 180] : [0, 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], desktop ? [140, -120] : [0, 0]);
  const quoteRotate = useTransform(scrollYProgress, [0, 1], [-20, 30]);

  const onStep = useCallback(
    (d) => setOpen((o) => (o + d + TESTIMONIALS.length) % TESTIMONIALS.length),
    []
  );
  const onClose = useCallback(() => setOpen(null), []);

  const cols = [TESTIMONIALS.slice(0, 3), TESTIMONIALS.slice(3, 6), TESTIMONIALS.slice(6, 9)];
  const ys = [y0, y1, y2];

  return (
    <section id="stories" ref={ref} className="section stories" aria-labelledby="stories-title">
      <motion.span className="stories-quote" style={{ rotate: quoteRotate }} aria-hidden="true">
        <Quote size={220} strokeWidth={1} />
      </motion.span>
      <div className="container stories-inner">
        <div className="stories-head">
          <Reveal>
            <Eyebrow>Video stories</Eyebrow>
          </Reveal>
          <h2 id="stories-title" className="h2 h2-xl">
            <SplitWords text="Hear it" /> <SplitWords text="from them." wordClassName="grad-text" delay={0.12} />
          </h2>
          <Reveal delay={0.15}>
            <p className="lead">
              Real Unmutex members, unscripted, on where they started, what changed and how it felt
              to finally speak up.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="stories-note">
            <span className="rec" /> Tap any story to watch with sound
          </Reveal>
        </div>

        <div className="vgrid">
          {cols.map((items, c) => (
            <Column key={c} items={items} offset={c * 3} y={ys[c]} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && <Player index={open} onClose={onClose} onStep={onStep} />}
      </AnimatePresence>
    </section>
  );
}
