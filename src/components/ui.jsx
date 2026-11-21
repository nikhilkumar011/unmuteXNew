import { Fragment } from "react";
import { motion } from "motion/react";
import {
  Users,
  Swords,
  Zap,
  BriefcaseBusiness,
  Mic,
  Star,
} from "lucide-react";
import { SITE } from "../data.js";
import { handleAnchorClick } from "../lib/smooth.js";

export const EASE = [0.22, 1, 0.36, 1];

export function joinProps(onClick = handleAnchorClick) {
  const href = SITE.joinLink;
  return href.startsWith("http")
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href, onClick };
}

export const ICONS = {
  users: Users,
  swords: Swords,
  zap: Zap,
  briefcase: BriefcaseBusiness,
  mic: Mic,
};

export function Reveal({ children, delay = 0, y = 28, className, as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export function SplitWords({ text, className, wordClassName = "", delay = 0, stagger = 0.06 }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <motion.span
              className={`word ${wordClassName}`}
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: delay + i * stagger, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}

export function Eyebrow({ children }) {
  return (
    <span className="eyebrow">
      <span className="eyebrow-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {children}
    </span>
  );
}

export function Stars({ value = 5, size = 16 }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={i < value ? "star on" : "star"}
        />
      ))}
    </span>
  );
}
