import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { useProgress } from "../lib/useProgress.js";
import { Link2, Video, Award, Rocket, ArrowRight, Check, MousePointer2, Flag } from "lucide-react";
import { STEPS } from "../data.js";
import { EASE, Eyebrow, joinProps } from "./ui.jsx";

const START = [0.0, 0.24, 0.48, 0.72];
const STEP_ICONS = [Link2, Video, Award, Rocket];

function StepNode({ i, progress, active, reduce }) {
  const s = START[i];
  const opacity = useTransform(progress, [s, s + 0.06], [0, 1]);
  const scale = useTransform(progress, [s, s + 0.08], [0.3, 1]);
  const y = useTransform(progress, [s, s + 0.08], [50, 0]);
  const Icon = STEP_ICONS[i];
  const state = active === i ? "is-active" : active > i ? "is-done" : "";
  return (
    <motion.li
      className={`chain-node ${state}`}
      style={{ opacity, scale: reduce ? 1 : scale, y: reduce ? 0 : y }}
      aria-current={active === i ? "step" : undefined}
    >
      <span className="node-orb">
        <span className="node-ring" />
        {active > i ? <Check size={22} strokeWidth={2.4} /> : <Icon size={22} strokeWidth={2} />}
      </span>
      <span className="node-num">0{i + 1}</span>
      <span className="node-label">{STEPS[i].short}</span>
    </motion.li>
  );
}

function Connector({ i, progress }) {
  const scaleX = useTransform(progress, [START[i] + 0.07, START[i + 1]], [0, 1]);
  const head = useTransform(progress, [START[i + 1] - 0.03, START[i + 1]], [0, 1]);
  return (
    <li className="chain-link" aria-hidden="true">
      <span className="link-track" />
      <motion.span className="link-fill" style={{ scaleX }} />
      <motion.span className="link-head" style={{ opacity: head }} />
    </li>
  );
}

function JoinScene() {
  return (
    <div className="scene scene-join">
      <motion.div
        className="sj-card"
        initial={{ y: 30, opacity: 0, rotate: -3 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="sj-url">
          <Link2 size={16} />
          <span className="typing">unmutex.community/join</span>
        </div>
        <img className="sj-logo" src="/images/logo.png" alt="" />
        <p className="sj-title">You've been invited to Unmutex</p>
        <motion.span
          className="sj-btn"
          animate={{ scale: [1, 1, 0.94, 1] }}
          transition={{ duration: 0.5, delay: 1.7, times: [0, 0.4, 0.7, 1] }}
        >
          Join the community
        </motion.span>
        <motion.span
          className="sj-cursor"
          initial={{ x: 120, y: 90, opacity: 0 }}
          animate={{ x: 30, y: 6, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
        >
          <MousePointer2 size={22} fill="currentColor" />
        </motion.span>
      </motion.div>
      <motion.div
        className="sj-toast"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4, visualDuration: 0.5, delay: 2.1 }}
      >
        <span className="toast-ic"><Check size={14} strokeWidth={3} /></span>
        You're in. Welcome aboard!
      </motion.div>
    </div>
  );
}

function RecordScene() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => (v >= 59 ? 0 : v + 1)), 160);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="scene scene-record">
      <motion.div
        className="phone"
        initial={{ y: 40, opacity: 0, rotate: 6 }}
        animate={{ y: 0, opacity: 1, rotate: -2 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <img src="/images/listener.jpg" alt="" />
        <span className="rec-badge">
          <span className="rec" /> REC 00:{String(t).padStart(2, "0")}
        </span>
        <span className="phone-wave">
          {Array.from({ length: 22 }, (_, i) => (
            <i key={i} style={{ animationDelay: `${(i * 113) % 800}ms` }} />
          ))}
        </span>
        <span className="phone-shutter" />
      </motion.div>
      <motion.div
        className="send-pill"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      >
        <span className="send-label">Sending intro.mp4</span>
        <span className="send-bar">
          <motion.i
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.4, delay: 0.8, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </div>
  );
}

const GROUP = [
  { src: "/images/speaker-woman.jpg", pos: "45% 20%", from: [-140, -90] },
  { src: "/images/thinker.jpg", pos: "50% 25%", from: [150, -110] },
  { src: "/images/listener.jpg", pos: "45% 30%", from: [-160, 80] },
  { src: "/images/speaking-man.jpg", pos: "50% 15%", from: [160, 100] },
  { src: "/images/speaker-man.jpg", pos: "45% 25%", from: [0, 150] },
];

function BadgeScene() {
  return (
    <div className="scene scene-badge">
      <motion.div
        className="badge-medal"
        initial={{ rotateY: 180, scale: 0.3, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.35, visualDuration: 0.9 }}
      >
        <Award size={40} strokeWidth={1.8} />
        <span>Rising Speaker</span>
      </motion.div>
      {GROUP.map((g, i) => {
        const a = (i / GROUP.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.img
            key={g.src}
            className="group-avatar"
            src={g.src}
            alt=""
            style={{ objectPosition: g.pos }}
            initial={{ x: g.from[0], y: g.from[1], opacity: 0, scale: 0.5 }}
            animate={{ x: Math.cos(a) * 112, y: Math.sin(a) * 92, opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.3, visualDuration: 0.7, delay: 0.5 + i * 0.1 }}
          />
        );
      })}
      <motion.span
        className="group-tag"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        Grouped with 5 peers at your level
      </motion.span>
    </div>
  );
}

const MILESTONES = [
  { label: "First GD", x: 40, y: 168 },
  { label: "Debate", x: 140, y: 96 },
  { label: "Extempore", x: 230, y: 140 },
  { label: "Mock interview", x: 318, y: 64 },
];

function JourneyScene() {
  return (
    <div className="scene scene-journey">
      <svg viewBox="0 0 400 220" className="journey-svg">
        <defs>
          <linearGradient id="jg" x1="0" x2="1">
            <stop offset="0" stopColor="#1E6BFF" />
            <stop offset="0.4" stopColor="#6D4AE0" />
            <stop offset="0.75" stopColor="#F0457E" />
            <stop offset="1" stopColor="#FF8A3D" />
          </linearGradient>
        </defs>
        <path
          d="M10 196 C 40 170, 30 168, 40 168 S 110 100, 140 96 S 200 150, 230 140 S 290 60, 318 64 S 370 20, 384 24"
          className="journey-track"
        />
        <motion.path
          d="M10 196 C 40 170, 30 168, 40 168 S 110 100, 140 96 S 200 150, 230 140 S 290 60, 318 64 S 370 20, 384 24"
          stroke="url(#jg)"
          className="journey-line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
        {MILESTONES.map((m, i) => (
          <motion.g
            key={m.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, visualDuration: 0.4, delay: 0.35 + i * 0.45 }}
          >
            <circle cx={m.x} cy={m.y} r="7" className="ms-dot" />
            <text x={m.x} y={m.y + 26} className="ms-label" textAnchor="middle">
              {m.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <motion.span
        className="journey-flag"
        initial={{ opacity: 0, y: 14, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, visualDuration: 0.5, delay: 2.1 }}
      >
        <Flag size={14} /> Interview-ready
      </motion.span>
    </div>
  );
}

const SCENES = [JoinScene, RecordScene, BadgeScene, JourneyScene];

export default function HowItWorks() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useProgress({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let a = -1;
    for (let i = 0; i < START.length; i++) if (v >= START[i] + 0.02) a = i;
    setActive(a);
  });

  const barScale = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const blobX = useTransform(scrollYProgress, [0, 1], ["-20%", "60%"]);
  const blobRotate = useTransform(scrollYProgress, [0, 1], [0, 140]);

  const Scene = active >= 0 ? SCENES[active] : null;
  const step = active >= 0 ? STEPS[active] : null;

  return (
    <section id="how" className="how" ref={ref} aria-labelledby="how-title">
      <div className="how-sticky">
        <motion.span className="how-blob" style={{ x: blobX, rotate: blobRotate }} aria-hidden="true" />
        <div className="container how-inner">
          <header className="how-head">
            <Eyebrow>How it works</Eyebrow>
            <h2 id="how-title" className="h2">
              From muted to <span className="grad-text">unstoppable</span>, in four steps.
            </h2>
          </header>

          <ol className="chain" aria-label="Steps to join Unmutex">
            {STEPS.map((s, i) => (
              <StepNodeWithLink key={s.key} i={i} progress={scrollYProgress} active={active} reduce={reduce} />
            ))}
          </ol>

          <div className="how-stage">
            <div className="how-text" aria-live="polite">
              <AnimatePresence mode="wait">
                {step ? (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(4px)", transition: { duration: 0.2 } }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <span className="step-count">
                      Step {active + 1} <span>/ 4</span>
                    </span>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-body">{step.body}</p>
                    {active === 0 && (
                      <a className="btn btn-primary" {...joinProps()}>
                        Get the invite link <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    )}
                    {active === 3 && (
                      <a className="btn btn-primary" {...joinProps()}>
                        Start your journey <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="intro"
                    className="how-intro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <p className="step-body">Keep scrolling. Your journey unfolds one step at a time.</p>
                    <span className="mouse" aria-hidden="true"><i /></span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="how-scene" aria-hidden="true">
              <AnimatePresence mode="wait">
                {Scene && (
                  <motion.div
                    key={active}
                    className="scene-wrap"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <Scene />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="popLayout">
                {active >= 0 && (
                  <motion.span
                    key={active}
                    className="how-bignum"
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -80 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    0{active + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="how-progress" aria-hidden="true">
            <motion.span style={{ scaleX: barScale }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepNodeWithLink({ i, progress, active, reduce }) {
  return (
    <>
      <StepNode i={i} progress={progress} active={active} reduce={reduce} />
      {i < STEPS.length - 1 && <Connector i={i} progress={progress} />}
    </>
  );
}
