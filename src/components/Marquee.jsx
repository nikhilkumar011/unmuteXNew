import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";

const WORDS = [
  "Group Discussions",
  "Debates",
  "Extempore",
  "Mock Interviews",
  "Vocabulary",
  "Feedback",
  "Mentorship",
  "Confidence",
];

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export default function Marquee({ baseVelocity = 2.2 }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(() => `${wrap(-50, 0, baseX.get())}%`);
  const dir = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = 1;
    else if (f > 0) dir.current = -1;
    let move = dir.current * baseVelocity * (delta / 1000);
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const row = (hidden) => (
    <span className="marquee-set" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <span className="marquee-item" key={w}>
          {w}
          <span className="marquee-sep" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="marquee" role="region" aria-label="What you practise at Unmutex">
      <motion.div className="marquee-track" style={{ x }}>
        {row(false)}
        {row(true)}
      </motion.div>
    </div>
  );
}
