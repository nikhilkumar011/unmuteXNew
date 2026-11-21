import { useLayoutEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "motion/react";
import { useProgress } from "../lib/useProgress.js";
import { ArrowRight } from "lucide-react";
import { ACTIVITIES } from "../data.js";
import { Eyebrow, ICONS } from "./ui.jsx";

function ActivityCard({ a, i, progress, count }) {
  const Icon = ICONS[a.icon];
  const center = (i + 0.5) / count;
  const rotate = useTransform(progress, [center - 0.4, center, center + 0.4], [4, 0, -4]);
  const imgX = useTransform(progress, [center - 0.5, center + 0.5], ["-8%", "8%"]);
  return (
    <motion.article className="act-card" style={{ rotate }}>
      <div className="act-media">
        <motion.img src={a.image} alt="" loading="lazy" style={{ x: imgX, scale: 1.2 }} />
        <span className="act-index">0{i + 1}</span>
      </div>
      <div className="act-body">
        <span className="act-ic"><Icon size={20} /></span>
        <h3>{a.title}</h3>
        <p>{a.body}</p>
        <ul className="tags" aria-label="Skills you practise">
          {a.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export default function Activities() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const dist = useMotionValue(0);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      dist.set(d);
      setHeight(window.innerHeight + d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [dist]);

  const scrollYProgress = useProgress({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * dist.get());
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section
      id="activities"
      ref={sectionRef}
      className="acts"
      style={{ height: height ? `${height}px` : "300vh" }}
      aria-labelledby="acts-title"
    >
      <div className="acts-sticky">
        <motion.div className="acts-track" ref={trackRef} style={{ x }}>
          <div className="acts-intro">
            <Eyebrow>What we conduct</Eyebrow>
            <h2 id="acts-title" className="h2">
              Every round you'll <span className="grad-text">face</span>, practised first.
            </h2>
            <p className="lead">
              Live sessions modelled on real selection rounds, so nothing on the big day feels new.
            </p>
            <span className="acts-hint" aria-hidden="true">
              Keep scrolling <ArrowRight size={16} />
            </span>
          </div>
          {ACTIVITIES.map((a, i) => (
            <ActivityCard key={a.title} a={a} i={i} progress={scrollYProgress} count={ACTIVITIES.length} />
          ))}
        </motion.div>
        <div className="acts-bar container" aria-hidden="true">
          <motion.span style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
