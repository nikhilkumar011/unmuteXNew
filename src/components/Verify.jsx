import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, ShieldX, LoaderCircle, ArrowRight, Award } from "lucide-react";
import { EASE } from "./ui.jsx";
import { fetchCertificate } from "../lib/api.js";

function nameFromPath() {
  const raw = window.location.pathname.replace(/^\/verify\//, "").replace(/\/$/, "");
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

function Seal({ ok }) {
  const Icon = ok ? ShieldCheck : ShieldX;
  return (
    <span className={`seal ${ok ? "ok" : "bad"}`} aria-hidden="true">
      {ok && (
        <>
          <motion.span className="seal-ring" initial={{ scale: 0.6, opacity: 0.6 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }} />
          <motion.span className="seal-ring" initial={{ scale: 0.6, opacity: 0.6 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.8 }} />
        </>
      )}
      <motion.span
        className="seal-core"
        initial={{ scale: 0, rotate: -120 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, visualDuration: 0.7 }}
      >
        <Icon size={42} strokeWidth={1.8} />
      </motion.span>
    </span>
  );
}

export default function Verify() {
  const [state, setState] = useState({ status: "loading" });
  const name = nameFromPath();

  useEffect(() => {
    document.title = `Verify ${name || "certificate"} — Unmutex`;
    if (!name) {
      setState({ status: "notfound" });
      return;
    }
    fetchCertificate(name)
      .then((cert) => setState({ status: "found", cert }))
      .catch((err) => setState(err.status === 404 ? { status: "notfound" } : { status: "error", message: err.message }));
  }, [name]);

  const { status, cert } = state;

  return (
    <section className="verify-page" aria-live="polite">
      <div className="cert-bg" aria-hidden="true">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
      </div>
      <div className="container">
        {status === "loading" && (
          <div className="verify-card verify-loading">
            <LoaderCircle size={30} className="spin" aria-hidden="true" />
            <p>Checking certificate…</p>
          </div>
        )}

        {status === "found" && (
          <motion.div className="verify-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Seal ok />
            <h1 className="verify-title">Certificate verified</h1>
            <p className="verify-sub">This certificate is authentic and was issued by Unmutex.</p>
            <dl className="verify-details">
              <div>
                <dt>Awarded to</dt>
                <dd>{cert.name}</dd>
              </div>
              <div>
                <dt>Issued on</dt>
                <dd>{formatDate(cert.issuedAt)}</dd>
              </div>
              <div>
                <dt>Issued by</dt>
                <dd>Unmutex</dd>
              </div>
            </dl>
            <motion.a
              className="verify-thumb"
              href={cert.preview}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
            >
              <img src={cert.preview} alt={`Unmutex certificate awarded to ${cert.name}`} />
            </motion.a>
            <div className="verify-actions">
              <a className="btn btn-primary" href="/">
                Explore Unmutex <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="btn btn-ghost" href="/certificate/">
                <Award size={16} aria-hidden="true" /> Find a certificate
              </a>
            </div>
          </motion.div>
        )}

        {(status === "notfound" || status === "error") && (
          <motion.div className="verify-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Seal ok={false} />
            <h1 className="verify-title">{status === "error" ? "We couldn't check this certificate" : "Certificate not found"}</h1>
            <p className="verify-sub">
              {status === "error"
                ? state.message
                : "We have no certificate under this name. The link may be mistyped, or the certificate wasn't issued by Unmutex."}
            </p>
            <div className="verify-actions">
              <a className="btn btn-primary" href="/certificate/">Search certificates</a>
              <a className="btn btn-ghost" href="/">Go to homepage</a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
