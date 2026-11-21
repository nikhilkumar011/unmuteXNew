import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { Phone, ArrowUpRight } from "lucide-react";
import { useProgress } from "../lib/useProgress.js";
import { CONTACT, NAV_LINKS } from "../data.js";
import { handleAnchorClick, IS_HOME, toSection } from "../lib/smooth.js";
import { joinProps } from "./ui.jsx";
import { InstagramIcon, LinkedinIcon, WhatsappIcon } from "./SocialIcons.jsx";

const SOCIALS = [
  { href: CONTACT.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
  { href: CONTACT.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: CONTACT.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export default function Footer() {
  const ref = useRef(null);
  const scrollYProgress = useProgress({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <footer ref={ref} id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href={IS_HOME ? "#top" : "/"} className="brand" onClick={handleAnchorClick} aria-label={IS_HOME ? "Back to top" : "Unmutex home"}>
              <img src="/images/logo.png" alt="" width="34" height="38" />
              <span>Unmutex</span>
            </a>
            <p className="muted">{CONTACT.tagline}</p>
            <div className="socials">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Unmutex on ${label}`} className="social-btn">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <h3>Explore</h3>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={toSection(l.href)} onClick={handleAnchorClick}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="footer-col">
            <h3>Get in touch</h3>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-line">
              <WhatsappIcon size={17} /> WhatsApp {CONTACT.phoneDisplay}
            </a>
            <a href={CONTACT.phoneTel} className="contact-line">
              <Phone size={17} aria-hidden="true" /> Call {CONTACT.phoneDisplay}
            </a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="contact-line">
              <InstagramIcon size={17} /> {CONTACT.instagramHandle}
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="contact-line">
              <LinkedinIcon size={17} /> Unmutex on LinkedIn
            </a>
            <a href="/book/" className="contact-line">
              <ArrowUpRight size={17} aria-hidden="true" /> Book a call
            </a>
          </div>

          <div className="footer-cta">
            <h3>Ready to unmute?</h3>
            <p className="muted">Send your 30-second intro video on WhatsApp and join the community.</p>
            <a className="btn btn-primary" {...joinProps()}>
              <WhatsappIcon size={18} /> Join on WhatsApp
            </a>
          </div>
        </div>

        <motion.p className="footer-word" style={{ y, opacity }} aria-hidden="true">
          Speak. Grow. Succeed.
        </motion.p>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Unmutex. Built for confidence. All rights reserved.</span>
          <span>Made for every voice that's been on mute.</span>
        </div>
      </div>
    </footer>
  );
}
