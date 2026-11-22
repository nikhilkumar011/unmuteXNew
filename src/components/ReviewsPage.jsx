import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, PlayCircle, MessageSquareQuote, PenLine, RotateCw, ArrowDown } from "lucide-react";
import { TESTIMONIALS } from "../data.js";
import { EASE, Eyebrow, Reveal, SplitWords, Stars } from "./ui.jsx";
import { VideoCard, Player } from "./VideoTestimonials.jsx";
import { Avatar } from "./Reviews.jsx";
import { useReviews } from "../lib/useReviews.js";
import { handleAnchorClick } from "../lib/smooth.js";

const formatMonth = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : null;

function Stat({ icon: Icon, value, label, delay }) {
  return (
    <motion.div
      className="rp-stat"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      <span className="rp-stat-ic" aria-hidden="true">
        <Icon size={20} />
      </span>
      <span>
        <strong>{value}</strong>
        <span>{label}</span>
      </span>
    </motion.div>
  );
}

function WrittenReview({ r, i }) {
  return (
    <motion.figure
      className="wcard"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
    >
      <div className="wcard-top">
        <Stars value={r.rating} />
        {r.date && <time dateTime={r.date}>{formatMonth(r.date)}</time>}
      </div>
      <blockquote>“{r.text}”</blockquote>
      <figcaption>
        <Avatar r={r} />
        <span>
          <strong>{r.name}</strong>
          {r.role && <span>{r.role}</span>}
        </span>
      </figcaption>
    </motion.figure>
  );
}

export default function ReviewsPage() {
  const { status, reviews, reload } = useReviews();
  const [playing, setPlaying] = useState(null);
  const onStep = useCallback((d) => setPlaying((o) => (o + d + TESTIMONIALS.length) % TESTIMONIALS.length), []);
  const onClose = useCallback(() => setPlaying(null), []);

  const ready = status === "ready";
  const avg = ready && reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "–";

  return (
    <div className="rp">
      <section className="rp-hero" aria-labelledby="rp-title">
        <div className="cert-bg" aria-hidden="true">
          <span className="blob blob-1" />
          <span className="blob blob-2" />
        </div>
        <div className="container rp-head">
          <Eyebrow>Reviews</Eyebrow>
          <h1 id="rp-title" className="h2 h2-xl">
            <SplitWords text="Every voice," /> <SplitWords text="in their own words." wordClassName="grad-text" delay={0.15} />
          </h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            Video stories and written reviews from Unmutex members, on where they started and how speaking feels now.
          </motion.p>
          <div className="rp-stats">
            <Stat icon={MessageSquareQuote} value={ready ? reviews.length : "–"} label="written reviews" delay={0.45} />
            <Stat icon={Star} value={avg} label="average rating" delay={0.55} />
            <Stat icon={PlayCircle} value={TESTIMONIALS.length} label="video stories" delay={0.65} />
          </div>
          <motion.nav
            className="rp-jump"
            aria-label="Jump to"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a href="#videos" onClick={handleAnchorClick}>
              Video stories <ArrowDown size={15} aria-hidden="true" />
            </a>
            <a href="#written" onClick={handleAnchorClick}>
              Written reviews <ArrowDown size={15} aria-hidden="true" />
            </a>
          </motion.nav>
        </div>
      </section>

      <section id="videos" className="section rp-section" aria-labelledby="rp-videos-title">
        <div className="container">
          <Reveal className="rp-section-head">
            <h2 id="rp-videos-title">Video stories</h2>
            <p className="muted">Tap any story to watch it with sound.</p>
          </Reveal>
          <div className="rp-video-grid">
            {TESTIMONIALS.map((t, i) => (
              <VideoCard key={t.id} t={t} i={i} onOpen={setPlaying} />
            ))}
          </div>
        </div>
      </section>

      <section id="written" className="section rp-section rp-written" aria-labelledby="rp-written-title" aria-busy={status === "loading"}>
        <div className="container">
          <Reveal className="rp-section-head">
            <h2 id="rp-written-title">Written reviews</h2>
            <p className="muted">Newest first, exactly as members wrote them.</p>
          </Reveal>

          {status === "loading" && (
            <div className="rp-masonry" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div className="wcard skeleton rcard" key={i}>
                  <span /><span /><span /><span />
                </div>
              ))}
            </div>
          )}
          {status === "error" && (
            <div className="rstatus" role="status">
              <p>We couldn't load reviews right now.</p>
              <button type="button" className="btn btn-ghost btn-sm" onClick={reload}>
                <RotateCw size={16} aria-hidden="true" /> Try again
              </button>
            </div>
          )}
          {ready && reviews.length === 0 && (
            <div className="rstatus" role="status">
              <p>No reviews yet. Be the first to share your story.</p>
            </div>
          )}
          {ready && reviews.length > 0 && (
            <div className="rp-masonry">
              {reviews.map((r, i) => (
                <WrittenReview key={r.id} r={r} i={i} />
              ))}
            </div>
          )}

          <Reveal className="rp-cta">
            <div>
              <h2>Been part of the journey?</h2>
              <p>Your story could be the push someone else needs to unmute.</p>
            </div>
            <a className="btn btn-primary btn-lg" href="/feedback/">
              <PenLine size={18} aria-hidden="true" /> Share your story
            </a>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {playing !== null && <Player index={playing} onClose={onClose} onStep={onStep} />}
      </AnimatePresence>
    </div>
  );
}
