import { useState } from "react";
import { CalendarCheck, Clock, MessageCircle, LoaderCircle, Check, Phone } from "lucide-react";
import { sendBooking } from "../lib/api.js";
import { CONTACT } from "../data.js";
import { WhatsappIcon } from "./SocialIcons.jsx";

const EMPTY = { name: "", email: "", phone: "", message: "" };

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email, like you@example.com.";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) e.phone = "Enter a valid mobile number (10 digits).";
  if (f.message.trim().length < 5) e.message = "Tell us briefly what you'd like to talk about.";
  return e;
}

export default function BookCall() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");
  const [sendError, setSendError] = useState("");

  const set = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    setTouched({ name: true, email: true, phone: true, message: true });
    if (Object.keys(e).length) {
      document.getElementById(`book-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    setSendError("");
    try {
      await sendBooking({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      setStatus("done");
      setForm(EMPTY);
      setTouched({});
    } catch (e) {
      setSendError(e.message);
      setStatus("error");
    }
  };

  const err = (k) => touched[k] && errors[k];
  const fieldProps = (k) => ({
    id: `book-${k}`,
    className: "input",
    value: form[k],
    onChange: set(k),
    onBlur: blur(k),
    "aria-invalid": !!err(k),
    "aria-describedby": err(k) ? `book-${k}-err` : undefined,
  });

  return (
    <section id="book" className="section book book-page" aria-labelledby="book-title">
      <div className="container book-inner">
        <div className="book-copy">
          <span className="eyebrow plain">Book a call</span>
          <h1 id="book-title" className="h2">Let's talk about your goals.</h1>
          <p className="lead">
            Tell us where you are and where you want to be. We'll get back to you to schedule a call.
          </p>
          <ul className="book-points">
            <li><Clock size={18} aria-hidden="true" /> A quick, no-pressure conversation</li>
            <li><MessageCircle size={18} aria-hidden="true" /> Interview prep, sessions or mentorship</li>
            <li><CalendarCheck size={18} aria-hidden="true" /> We'll reply within 24 hours</li>
          </ul>
          <div className="book-alt">
            <p>Prefer to chat right away?</p>
            <div className="book-alt-links">
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                <WhatsappIcon size={17} /> WhatsApp us
              </a>
              <a href={CONTACT.phoneTel} className="btn btn-ghost btn-sm">
                <Phone size={17} aria-hidden="true" /> {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <div className="book-card">
          {status === "done" ? (
            <div className="book-done" role="status">
              <span className="done-ic small"><Check size={22} strokeWidth={3} /></span>
              <h3>Request received</h3>
              <p>Thanks for reaching out. We'll be in touch shortly to book your call.</p>
              <button className="btn btn-ghost" onClick={() => setStatus("idle")}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="field">
                <label className="label" htmlFor="book-name">Name</label>
                <input {...fieldProps("name")} autoComplete="name" placeholder="Your full name" />
                {err("name") && <p id="book-name-err" className="err">{errors.name}</p>}
              </div>
              <div className="row-2">
                <div className="field">
                  <label className="label" htmlFor="book-email">Email</label>
                  <input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" />
                  {err("email") && <p id="book-email-err" className="err">{errors.email}</p>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="book-phone">Mobile number</label>
                  <input {...fieldProps("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" />
                  {err("phone") && <p id="book-phone-err" className="err">{errors.phone}</p>}
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="book-message">What would you like to talk about?</label>
                <textarea {...fieldProps("message")} rows={4} placeholder="e.g. I have placement interviews next month and freeze up in GDs." />
                {err("message") && <p id="book-message-err" className="err">{errors.message}</p>}
              </div>
              {status === "error" && <p className="err" role="alert">{sendError}</p>}
              <button type="submit" className="btn btn-dark btn-lg btn-block" disabled={status === "sending"}>
                {status === "sending" ? (
                  <><LoaderCircle size={18} className="spin" aria-hidden="true" /> Sending…</>
                ) : (
                  "Send & book a call"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
