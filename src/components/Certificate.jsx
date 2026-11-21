import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { Award, Search, Download, Expand, ShieldCheck, Copy, Check, LoaderCircle, ScanLine, CalendarDays } from "lucide-react";
import { EASE, Eyebrow, SplitWords } from "./ui.jsx";
import { fetchCertificate } from "../lib/api.js";
import { CONTACT } from "../data.js";
import { WhatsappIcon } from "./SocialIcons.jsx";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

function TiltPreview({ cert }) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });
  const shineX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="cert-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.figure className="cert-frame" style={{ rotateX: rx, rotateY: ry }}>
        {!loaded && <span className="cert-skeleton" aria-hidden="true" />}
        <img
          src={cert.preview}
          alt={`Unmutex certificate awarded to ${cert.name}`}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
        <motion.span className="cert-shine" style={{ left: shineX }} aria-hidden="true" />
      </motion.figure>
    </div>
  );
}

function CopyLink({ url }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this verification link:", url);
    }
  };
  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {copied ? "Link copied" : "Copy verify link"}
    </button>
  );
}

function Result({ cert }) {
  const verifyUrl = `${window.location.origin}${cert.verifyPath}`;
  const issued = formatDate(cert.issuedAt);
  const fileName = `${cert.name.replace(/\s+/g, "_")}_certificate.png`;
  return (
    <motion.div
      className="cert-result"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <TiltPreview cert={cert} />

      <div className="cert-side">
        <motion.span
          className="cert-verified"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, visualDuration: 0.5, delay: 0.25 }}
        >
          <ShieldCheck size={16} aria-hidden="true" /> Verified certificate
        </motion.span>
        <h2 className="cert-name">{cert.name}</h2>
        {issued && (
          <p className="cert-meta">
            <CalendarDays size={16} aria-hidden="true" /> Issued {issued}
          </p>
        )}

        <div className="cert-actions">
          <a className="btn btn-primary btn-lg" href={cert.certificate} download={fileName}>
            <Download size={18} aria-hidden="true" /> Download certificate
          </a>
          <a className="btn btn-ghost btn-lg" href={cert.preview} target="_blank" rel="noopener noreferrer">
            <Expand size={18} aria-hidden="true" /> View full size
          </a>
        </div>

        {cert.qrCode && (
          <div className="cert-qr">
            <div className="qr-box">
              <img src={cert.qrCode} alt={`QR code that verifies ${cert.name}'s certificate`} />
              <span className="qr-scan" aria-hidden="true" />
            </div>
            <div className="qr-copy">
              <strong>
                <ScanLine size={17} aria-hidden="true" /> Scan to verify
              </strong>
              <p>
                This QR code is printed on your certificate. Anyone who scans it lands on its verification page on our website.
              </p>
              <div className="qr-links">
                <a href={cert.verifyPath} className="text-link">Open verification page</a>
                <CopyLink url={verifyUrl} />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Certificate() {
  const [name, setName] = useState("");
  const [state, setState] = useState({ status: "idle" });
  const inputRef = useRef(null);

  const search = async (raw) => {
    const value = raw.replace(/\s+/g, " ").trim();
    if (!value) {
      setState({ status: "invalid", message: "Please enter your full name." });
      inputRef.current?.focus();
      return;
    }
    setState({ status: "loading" });
    try {
      const cert = await fetchCertificate(value);
      setState({ status: "found", cert });
      const url = new URL(window.location.href);
      url.searchParams.set("name", cert.name);
      history.replaceState(null, "", url);
    } catch (err) {
      setState(err.status === 404 ? { status: "notfound", query: value } : { status: "error", message: err.message });
    }
  };

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("name");
    if (initial) {
      setName(initial);
      search(initial);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    search(name);
  };

  const { status } = state;

  return (
    <section className="cert-page" aria-labelledby="cert-title">
      <div className="cert-bg" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
      </div>
      <div className="container">
        <header className="cert-head">
          <motion.span
            className="cert-medal"
            initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.45, visualDuration: 0.7 }}
            aria-hidden="true"
          >
            <Award size={34} strokeWidth={1.8} />
          </motion.span>
          <Eyebrow>Certificates</Eyebrow>
          <h1 id="cert-title" className="h2 h2-xl">
            <SplitWords text="Your certificate," /> <SplitWords text="earned out loud." wordClassName="grad-text" delay={0.15} />
          </h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            Enter the name you registered with to view, download and verify your Unmutex certificate.
          </motion.p>
        </header>

        <motion.form
          className="cert-search"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
        >
          <label htmlFor="cert-name" className="label">Full name</label>
          <div className="cert-search-row">
            <span className="cert-search-field">
              <Search size={20} aria-hidden="true" />
              <input
                ref={inputRef}
                id="cert-name"
                className="input"
                autoComplete="name"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={status === "invalid"}
                aria-describedby="cert-hint"
              />
            </span>
            <button type="submit" className="btn btn-primary btn-lg" disabled={status === "loading"}>
              {status === "loading" ? <LoaderCircle size={18} className="spin" aria-hidden="true" /> : null}
              {status === "loading" ? "Searching…" : "Find my certificate"}
            </button>
          </div>
          <p id="cert-hint" className={status === "invalid" ? "err" : "cert-hint"}>
            {status === "invalid" ? state.message : "Use your full name exactly as you registered. Capital letters don't matter."}
          </p>
        </motion.form>

        <div className="cert-output" aria-live="polite">
          <AnimatePresence mode="wait">
            {status === "found" && <Result key={state.cert.name} cert={state.cert} />}
            {status === "notfound" && (
              <motion.div
                key="nf"
                className="cert-empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <h2>We couldn't find a certificate for “{state.query}”</h2>
                <ul>
                  <li>Check the spelling and use your full name, as you registered it.</li>
                  <li>Certificates are issued after you complete a program, so yours may not be ready yet.</li>
                </ul>
                <a className="btn btn-ghost" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon size={17} /> Ask us on WhatsApp
                </a>
              </motion.div>
            )}
            {status === "error" && (
              <motion.div key="err" className="cert-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert">
                <h2>Something went wrong</h2>
                <p>{state.message}</p>
                <button className="btn btn-ghost" onClick={() => search(name)}>Try again</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
