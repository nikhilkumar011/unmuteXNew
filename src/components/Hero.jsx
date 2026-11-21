import { Fragment, useRef } from "react";
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useProgress } from "../lib/useProgress.js";
import { ArrowRight, Mic, MessagesSquare, Swords, Zap, BriefcaseBusiness, Play } from "lucide-react";
import { EASE, joinProps } from "./ui.jsx";
import { handleAnchorClick } from "../lib/smooth.js";
import { useMediaQuery } from "../lib/useMediaQuery.js";

const LINES = [
  [{ w: "Unmute" }, { w: "the" }],
  [{ w: "speaker", grad: true }, { w: "in" }, { w: "you." }],
];

function HeroTitle() {
  let n = 0;
  return (
    <h1 className="hero-title" aria-label="Unmute the speaker in you.">
      {LINES.map((line, li) => (
        <span className="hero-line" key={li} aria-hidden="true">
          {line.map((t, i) => {
            const d = 0.15 + n++ * 0.08;
            return (
              <Fragment key={i}>
                <span className="word-mask">
                  <motion.span
                    className={`word ${t.grad ? "grad-text" : ""}`}
                    initial={{ y: "115%", rotate: 4 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{ duration: 0.9, delay: d, ease: EASE }}
                  >
                    {t.w}
                  </motion.span>
                </span>
                {i < line.length - 1 ? " " : ""}
              </Fragment>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function Wave({ bars = 18 }) {
  return (
    <span className="wave" aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <i key={i} style={{ animationDelay: `${(i * 97) % 900}ms` }} />
      ))}
    </span>
  );
}

const CHIPS = [
  { label: "Debates", Icon: Swords, cls: "chip-a" },
  { label: "Extempore", Icon: Zap, cls: "chip-b" },
  { label: "Group Discussions", Icon: MessagesSquare, cls: "chip-c" },
  { label: "Mock Interviews", Icon: BriefcaseBusiness, cls: "chip-d" },
];

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 960px)");
  const scrollYProgress = useProgress({ target: ref, offset: ["start start", "end start"] });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const k = desktop ? 1 : 0.4;
  const yA = useTransform(scrollYProgress, [0, 1], [0, -240 * k]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, -120 * k]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, -340 * k]);
  const yChips = useTransform(scrollYProgress, [0, 1], [0, -420 * k]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const pxA = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const pyA = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const pxB = useTransform(sx, [-0.5, 0.5], [26, -26]);
  const pyB = useTransform(sy, [-0.5, 0.5], [20, -20]);
  const pxC = useTransform(sx, [-0.5, 0.5], [-34, 34]);
  const pyC = useTransform(sy, [-0.5, 0.5], [-26, 26]);

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  const enter = (i) => ({
    initial: { opacity: 0, y: 60, scale: 0.92 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 1, delay: 0.35 + i * 0.12, ease: EASE },
  });

  return (
    <section id="top" className="hero" ref={ref} onPointerMove={onPointerMove}>
      <div className="hero-bg" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="grid-fade" />
      </div>

      <div className="container hero-inner">
        <motion.div className="hero-copy" style={{ y: textY, opacity: textOpacity }}>
          <motion.div
            className="pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="pill-dot" /> Communication community for interview prep
          </motion.div>

          <HeroTitle />

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            Practise group discussions, debates, extempore and mock interviews with real people.
            Get honest feedback, and walk into your next interview ready to speak.
          </motion.p>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
          >
            <a className="btn btn-primary btn-lg" {...joinProps()}>
              Join the community <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="/book/" className="btn btn-ghost btn-lg">
              Book a free call
            </a>
          </motion.div>

          <motion.a
            href="#stories"
            onClick={handleAnchorClick}
            className="hero-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
          >
            <span className="avatars" aria-hidden="true">
              <img src="/images/speaker-woman.jpg" alt="" style={{ objectPosition: "45% 20%" }} />
              <img src="/images/thinker.jpg" alt="" style={{ objectPosition: "50% 25%" }} />
              <img src="/images/listener.jpg" alt="" style={{ objectPosition: "45% 30%" }} />
              <img src="/images/speaking-man.jpg" alt="" style={{ objectPosition: "50% 15%" }} />
            </span>
            <span>
              <strong>Real members, real stories.</strong>
              <span className="muted"> Watch them <Play size={12} aria-hidden="true" /></span>
            </span>
          </motion.a>
        </motion.div>

        <div className="hero-visual" aria-hidden="true">
          <motion.div className="ring-wrap" style={{ rotate: ringRotate, scale: ringScale }}>
            <motion.div
              className="ring"
              initial={{ opacity: 0, scale: 0.6, rotate: -60 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
          </motion.div>

          <motion.div className="mic-core" {...enter(0)}>
            <Mic size={34} strokeWidth={1.8} />
            <Wave />
          </motion.div>

          <motion.div className="hv hv-a" style={{ y: yA }}>
            <motion.div style={{ x: pxA, y: pyA }}>
              <motion.figure className="photo" {...enter(1)}>
                <img src="/images/speaker-woman.jpg" alt="" />
              </motion.figure>
            </motion.div>
          </motion.div>

          <motion.div className="hv hv-b" style={{ y: yB }}>
            <motion.div style={{ x: pxB, y: pyB }}>
              <motion.figure className="photo" {...enter(2)}>
                <img src="/images/speaking-man.jpg" alt="" />
                <span className="live-tag">
                  <span className="rec" /> Speaking now
                </span>
              </motion.figure>
            </motion.div>
          </motion.div>

          <motion.div className="hv hv-c" style={{ y: yC }}>
            <motion.div style={{ x: pxC, y: pyC }}>
              <motion.figure className="photo photo-call" {...enter(3)}>
                <img src="/images/video-call.jpg" alt="" />
              </motion.figure>
            </motion.div>
          </motion.div>

          <motion.div className="hv-chips" style={{ y: yChips }}>
            {CHIPS.map(({ label, Icon, cls }, i) => (
              <motion.span
                key={label}
                className={`float-chip ${cls}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.45, visualDuration: 0.6, delay: 0.9 + i * 0.12 }}
              >
                <Icon size={16} /> {label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="scroll-cue"
        style={{ opacity: textOpacity }}
        aria-hidden="true"
      >
        <span className="mouse"><i /></span>
        Scroll to explore
      </motion.div>
    </section>
  );
}
