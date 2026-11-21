import { useRef, useState } from "react";
import { motion, AnimatePresence, useTransform } from "motion/react";
import { GraduationCap, ChevronDown, Quote, ArrowRight } from "lucide-react";
import { FOUNDERS, CORE_TEAM } from "../data.js";
import { EASE, Eyebrow, Reveal, SplitWords, joinProps } from "./ui.jsx";
import { useProgress } from "../lib/useProgress.js";
import { InstagramIcon, LinkedinIcon } from "./SocialIcons.jsx";

function Socials({ person }) {
  const links = [
    person.linkedin && { href: person.linkedin, label: `${person.name} on LinkedIn`, Icon: LinkedinIcon },
    person.instagram && { href: person.instagram, label: `${person.name} on Instagram`, Icon: InstagramIcon },
  ].filter(Boolean);
  if (!links.length) return null;
  return (
    <div className="socials">
      {links.map(({ href, label, Icon }) => (
        <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-btn">
          <Icon size={17} />
        </a>
      ))}
    </div>
  );
}

function FounderPhoto({ person, flip }) {
  const ref = useRef(null);
  const p = useProgress({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(p, [0, 1], [-50, 50]);
  const clip = useTransform(p, [0, 0.32], ["inset(14% 12% 14% 12% round 32px)", "inset(0% 0% 0% 0% round 32px)"]);
  const rotate = useTransform(p, [0, 0.5, 1], [flip ? -6 : 6, 0, flip ? 4 : -4]);
  return (
    <div ref={ref} className="founder-media">
      <motion.span className="founder-halo" style={{ rotate }} aria-hidden="true" />
      <motion.figure className="founder-photo" style={{ clipPath: clip }}>
        <motion.img src={person.image} alt={`Portrait of ${person.name}`} style={{ y, scale: 1.18 }} loading="lazy" />
      </motion.figure>
      <motion.span
        className="founder-badge"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ type: "spring", bounce: 0.45, visualDuration: 0.6, delay: 0.3 }}
      >
        {person.role.split(" & ")[0]}
      </motion.span>
    </div>
  );
}

function Founder({ person, flip }) {
  const [open, setOpen] = useState(false);
  const id = `bio-${person.name.split(" ")[0].toLowerCase()}`;
  return (
    <article className={`founder ${flip ? "flip" : ""}`}>
      <FounderPhoto person={person} flip={flip} />
      <div className="founder-body">
        <Reveal>
          <span className="role-chip">{person.role}</span>
        </Reveal>
        <h3 className="founder-name">
          <SplitWords text={person.name} />
        </h3>
        {person.college && (
          <Reveal delay={0.1} className="college">
            <GraduationCap size={18} aria-hidden="true" /> {person.college}
          </Reveal>
        )}
        <Reveal delay={0.15} as="blockquote" className="founder-quote">
          <Quote size={26} aria-hidden="true" />
          <span className="grad-text">{person.tagline}</span>
        </Reveal>
        <Reveal delay={0.2} className="founder-bio">
          <p>{person.bio[0]}</p>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={id}
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ overflow: "hidden" }}
              >
                {person.bio.slice(1).map((para) => (
                  <p key={para.slice(0, 20)}>{para}</p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="founder-actions">
            {person.bio.length > 1 && (
              <button
                type="button"
                className="read-more"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpen((o) => !o)}
              >
                {open ? "Show less" : "Read full story"}
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={18} aria-hidden="true" />
                </motion.span>
              </button>
            )}
            <Socials person={person} />
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function MemberCard({ person, i }) {
  return (
    <motion.article
      className="member"
      initial={{ opacity: 0, y: 60, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
      whileHover={{ y: -8 }}
    >
      <figure className="member-photo">
        <img src={person.image} alt={`Portrait of ${person.name}`} loading="lazy" />
        <span className="member-tag">{person.tagline}</span>
      </figure>
      <div className="member-body">
        <h3>{person.name}</h3>
        <span className="member-role">{person.role}</span>
        <p>{person.bio}</p>
        <Socials person={person} />
      </div>
    </motion.article>
  );
}

export default function Team() {
  return (
    <section id="team" className="section team team-page" aria-labelledby="team-title">
      <div className="container">
        <div className="section-head center">
          <Reveal>
            <Eyebrow>Our team</Eyebrow>
          </Reveal>
          <h1 id="team-title" className="h2 h2-xl">
            <SplitWords text="The voices" /> <SplitWords text="behind Unmutex." wordClassName="grad-text" delay={0.12} />
          </h1>
          <Reveal delay={0.15}>
            <p className="lead">
              We started where many of our members start: knowing what to say, but not how to say it.
              Here are the people who turned that struggle into a community.
            </p>
          </Reveal>
        </div>

        <div className="founders">
          {FOUNDERS.map((f, i) => (
            <Founder key={f.name} person={f} flip={i % 2 === 1} />
          ))}
        </div>

        <div className="core">
          <Reveal className="core-head">
            <h3>Core team</h3>
            <p className="muted">The people who keep the sessions running, the product shipping and the community thriving.</p>
          </Reveal>
          <div className="core-grid">
            {CORE_TEAM.map((m, i) => (
              <MemberCard key={m.name} person={m} i={i} />
            ))}
          </div>
        </div>

        <Reveal className="team-cta">
          <div>
            <h2>Want to learn with us?</h2>
            <p>Join the community or book a call, and meet the team in your first session.</p>
          </div>
          <div className="team-cta-actions">
            <a className="btn btn-primary btn-lg" {...joinProps()}>
              Join the community <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="btn btn-ghost btn-lg" href="/book/">
              Book a call
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
