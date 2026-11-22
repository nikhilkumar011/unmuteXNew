import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, RotateCw, PenLine } from "lucide-react";
import { Eyebrow, Reveal, Stars } from "./ui.jsx";
import { lockScroll } from "../lib/smooth.js";
import { useReviews } from "../lib/useReviews.js";

const CLAMP_AT = 230;

const initials = (n) =>
  n
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function Avatar({ r }) {
  return r.avatar ? (
    <img className="rav" src={r.avatar} alt="" loading="lazy" />
  ) : (
    <span className="rav" aria-hidden="true">{initials(r.name)}</span>
  );
}

function ReviewCard({ r, onOpen, hidden }) {
  const long = r.text.length > CLAMP_AT;
  return (
    <figure className="rcard">
      <Stars value={r.rating} />
      <blockquote className={long ? "clamped" : ""}>“{r.text}”</blockquote>
      {long && (
        <button type="button" className="rmore" onClick={() => onOpen(r)} tabIndex={hidden ? -1 : 0}>
          Read more
        </button>
      )}
      <figcaption>
        <Avatar r={r} />
        <span>
          <strong>{r.name}</strong>
          {r.role && <span>{r.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse, onOpen }) {
  const speed = Math.max(30, items.length * 9);
  return (
    <div className={`rrow ${reverse ? "reverse" : ""}`} style={{ "--dur": `${speed}s` }}>
      <div className="rtrack">
        <div className="rset">
          {items.map((r) => (
            <ReviewCard key={r.id} r={r} onOpen={onOpen} />
          ))}
        </div>
        <div className="rset" aria-hidden="true">
          {items.map((r) => (
            <ReviewCard key={r.id} r={r} onOpen={onOpen} hidden />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="rrow">
      <div className="rset">
        {Array.from({ length: 5 }, (_, i) => (
          <div className="rcard skeleton" key={i} aria-hidden="true">
            <span /><span /><span /><span />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewDialog({ review, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    lockScroll(true);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="rdialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="rdialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Review by ${review.name}`}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } }}
        transition={{ type: "spring", bounce: 0.2, visualDuration: 0.35 }}
      >
        <button ref={closeRef} className="rdialog-close" onClick={onClose} aria-label="Close review">
          <X size={20} />
        </button>
        <Stars value={review.rating} size={18} />
        <blockquote>“{review.text}”</blockquote>
        <div className="rdialog-by">
          <Avatar r={review} />
          <span>
            <strong>{review.name}</strong>
            {review.role && <span>{review.role}</span>}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Reviews() {
  const { status, reviews, reload: load } = useReviews();
  const [open, setOpen] = useState(null);

  const onClose = useCallback(() => setOpen(null), []);
  const a = reviews.filter((_, i) => i % 2 === 0);
  const b = reviews.filter((_, i) => i % 2 === 1);
  const twoRows = reviews.length >= 6;

  return (
    <section id="reviews" className="section reviews" aria-labelledby="reviews-title">
      <div className="container section-head center">
        <Reveal>
          <Eyebrow>Reviews</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="reviews-title" className="h2">
            Loved by people who <span className="grad-text">found their voice</span>.
          </h2>
        </Reveal>
      </div>

      <div className="rrows" aria-busy={status === "loading"}>
        {status === "loading" && (
          <>
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}
        {status === "error" && (
          <div className="container rstatus" role="status">
            <p>We couldn't load reviews right now.</p>
            <button type="button" className="btn btn-ghost btn-sm" onClick={load}>
              <RotateCw size={16} aria-hidden="true" /> Try again
            </button>
          </div>
        )}
        {status === "ready" && reviews.length === 0 && (
          <div className="container rstatus" role="status">
            <p>No reviews yet. Be the first to share your story below.</p>
          </div>
        )}
        {status === "ready" && reviews.length > 0 && (
          twoRows ? (
            <>
              <Row items={a} onOpen={setOpen} />
              <Row items={b} reverse onOpen={setOpen} />
            </>
          ) : (
            <Row items={reviews} onOpen={setOpen} />
          )
        )}
      </div>

      <Reveal className="container reviews-cta">
        <span className="muted">Been part of the journey?</span>
        <a href="/feedback/" className="btn btn-ghost btn-sm">
          <PenLine size={16} aria-hidden="true" /> Share your story
        </a>
      </Reveal>

      <AnimatePresence>{open && <ReviewDialog review={open} onClose={onClose} />}</AnimatePresence>
    </section>
  );
}
