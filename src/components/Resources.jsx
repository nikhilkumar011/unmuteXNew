import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, BookOpen, MessageSquareText, HeartHandshake, CalendarCheck } from "lucide-react";
import { EASE, Eyebrow, Reveal } from "./ui.jsx";

function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Card({ className = "", i, children }) {
  return (
    <motion.article
      className={`res-card ${className}`}
      onPointerMove={spotlight}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, delay: i * 0.1, ease: EASE }}
      whileHover={{ y: -6 }}
    >
      {children}
    </motion.article>
  );
}

const FRAMEWORKS = [
  { k: "PREP", v: ["Point", "Reason", "Example", "Point"] },
  { k: "STAR", v: ["Situation", "Task", "Action", "Result"] },
  { k: "3W", v: ["What", "So what", "Now what"] },
];

function FrameworkDemo() {
  return (
    <div className="fw-demo" aria-hidden="true">
      {FRAMEWORKS.map((f, r) => (
        <div className="fw-row" key={f.k}>
          <motion.span
            className="fw-key"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + r * 0.25, duration: 0.5, ease: EASE }}
          >
            {f.k}
          </motion.span>
          {f.v.map((s, i) => (
            <motion.span
              key={`${s}-${i}`}
              className="fw-step"
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 + r * 0.25 + i * 0.08, type: "spring", bounce: 0.35, visualDuration: 0.45 }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

const VOCAB = [
  { w: "Articulate", d: "express an idea clearly and fluently" },
  { w: "Concise", d: "giving a lot of information in few words" },
  { w: "Pragmatic", d: "dealing with things sensibly and realistically" },
  { w: "Nuanced", d: "showing subtle differences in meaning" },
  { w: "Compelling", d: "evoking interest in a powerful way" },
];

function VocabDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % VOCAB.length), 2600);
    return () => clearInterval(id);
  }, []);
  const item = VOCAB[i];
  return (
    <div className="vocab-demo" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.w}
          initial={{ opacity: 0, rotateX: -70, y: 16 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: 70, y: -16, transition: { duration: 0.2 } }}
          transition={{ duration: 0.45, ease: EASE }}
          className="vocab-word"
        >
          <strong>{item.w}</strong>
          <span>{item.d}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const SCORES = [
  { k: "Clarity", v: 0.86 },
  { k: "Structure", v: 0.72 },
  { k: "Pace", v: 0.64 },
  { k: "Confidence", v: 0.9 },
];

function FeedbackDemo() {
  return (
    <div className="fb-demo" aria-hidden="true">
      {SCORES.map((s, i) => (
        <div className="fb-row" key={s.k}>
          <span>{s.k}</span>
          <span className="fb-bar">
            <motion.i
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: s.v }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.3 + i * 0.12, ease: EASE }}
            />
          </span>
        </div>
      ))}
      <motion.p
        className="fb-note"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        "Strong opener. Pause before your second point."
      </motion.p>
    </div>
  );
}

function MentorDemo() {
  return (
    <div className="mentor-demo" aria-hidden="true">
      <div className="mentor-pair">
        <motion.img
          src="/images/presenter.jpg"
          alt=""
          style={{ objectPosition: "18% 30%" }}
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        />
        <span className="mentor-link">
          <i /><i /><i />
        </span>
        <motion.img
          src="/images/thinker.jpg"
          alt=""
          style={{ objectPosition: "50% 25%" }}
          initial={{ x: 30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        />
      </div>
      <motion.span
        className="mentor-chip"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <CalendarCheck size={14} /> 1:1 session booked
      </motion.span>
      <ul className="agenda">
        {AGENDA.map((a, i) => (
          <motion.li
            key={a.t}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.5, ease: EASE }}
          >
            <span className="agenda-time">{a.m}</span>
            <span>
              <strong>{a.t}</strong>
              <span>{a.d}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const AGENDA = [
  { m: "10 min", t: "Your goals", d: "Target roles, rounds and timelines" },
  { m: "30 min", t: "Live mock round", d: "HR or role-specific questions" },
  { m: "20 min", t: "Your action plan", d: "What to practise before next time" },
];

export default function Resources() {
  return (
    <section id="resources" className="section res">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <Eyebrow>What you get</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h2">
              Resources that make practice <span className="grad-text">stick</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">
              Sessions build the habit. These tools turn every session into lasting progress.
            </p>
          </Reveal>
        </div>

        <div className="res-grid">
          <Card className="res-wide" i={0}>
            <span className="res-ic"><Layers size={20} /></span>
            <h3>Communication frameworks</h3>
            <p>Proven structures that make any answer clear, from a GD point to a behavioural interview story.</p>
            <FrameworkDemo />
          </Card>
          <Card i={1}>
            <span className="res-ic"><BookOpen size={20} /></span>
            <h3>Vocabulary tips &amp; guides</h3>
            <p>Words you'll actually use, with context, so you sound precise without sounding rehearsed.</p>
            <VocabDemo />
          </Card>
          <Card i={2}>
            <span className="res-ic"><MessageSquareText size={20} /></span>
            <h3>Personalised feedback</h3>
            <p>Specific notes after every session on what worked, what didn't, and what to try next.</p>
            <FeedbackDemo />
          </Card>
          <Card className="res-wide" i={3}>
            <span className="res-ic"><HeartHandshake size={20} /></span>
            <h3>1:1 sessions &amp; mentorship</h3>
            <p>Private time with a mentor to rehearse your interviews, shape your story and work on what's holding you back.</p>
            <MentorDemo />
          </Card>
        </div>
      </div>
    </section>
  );
}
