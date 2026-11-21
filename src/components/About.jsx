import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useProgress } from "../lib/useProgress.js";
import { Users, Target } from "lucide-react";
import { Eyebrow, Reveal } from "./ui.jsx";

const STATEMENT =
  "Unmutex is a community of students and young professionals who show up to speak, not just to listen. We practise out loud, together, and turn every session into feedback you can use, so the next time it matters, your voice is ready.";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="sw">
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  );
}

function ScrollStatement() {
  const ref = useRef(null);
  const scrollYProgress = useProgress({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");
  return (
    <p ref={ref} className="statement" aria-label={STATEMENT}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  );
}

function ParallaxImage({ src, alt, speed = 80, className = "" }) {
  const ref = useRef(null);
  const scrollYProgress = useProgress({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(18% 10% 18% 10% round 28px)", "inset(0% 0% 0% 0% round 28px)"]);
  return (
    <motion.figure ref={ref} className={`pimg ${className}`} style={{ clipPath: clip }}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.25 }} loading="lazy" />
    </motion.figure>
  );
}

function SlideWord({ text, from, progress }) {
  const x = useTransform(progress, [0, 1], [from, 0]);
  return (
    <motion.span className="slide-word" style={{ x }}>
      {text}
      <span className="dot" />
    </motion.span>
  );
}

function Motto() {
  const ref = useRef(null);
  const scrollYProgress = useProgress({ target: ref, offset: ["start end", "center 0.6"] });
  return (
    <div ref={ref} className="motto" aria-label="Speak. Grow. Succeed.">
      <span aria-hidden="true">
        <SlideWord text="Speak" from={-220} progress={scrollYProgress} />
        <SlideWord text="Grow" from={220} progress={scrollYProgress} />
        <SlideWord text="Succeed" from={-160} progress={scrollYProgress} />
      </span>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <Reveal>
          <Eyebrow>Who we are</Eyebrow>
        </Reveal>
        <ScrollStatement />

        <div className="about-grid">
          <div className="about-col">
            <ParallaxImage src="/images/group-discussion.jpg" alt="Members in a group discussion at Unmutex" speed={60} />
            <Reveal className="about-card">
              <span className="about-ic"><Users size={22} /></span>
              <h3>Who we are</h3>
              <p>
                A peer-driven speaking community built for people who know what they want to say,
                but freeze, ramble or go quiet when it's time to say it. Mentors and members who have
                been there, cheering each other on.
              </p>
            </Reveal>
          </div>
          <div className="about-col about-col-offset">
            <Reveal className="about-card">
              <span className="about-ic"><Target size={22} /></span>
              <h3>What we do</h3>
              <p>
                We run structured speaking sessions that mirror real selection rounds, from GDs and
                debates to extempore and full mock interviews, then follow up with feedback,
                frameworks and mentorship so you improve every single week.
              </p>
            </Reveal>
            <ParallaxImage src="/images/presenter.jpg" alt="An Unmutex member presenting to a room" speed={90} />
          </div>
        </div>

        <Motto />
      </div>
    </section>
  );
}
