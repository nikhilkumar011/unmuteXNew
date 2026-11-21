import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Send, Check, LoaderCircle, ImagePlus, X } from "lucide-react";
import { EASE, Eyebrow, Reveal } from "./ui.jsx";
import { postReview, resizeImage } from "../lib/api.js";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Outstanding"];
const MAX = 2000;
const MIN = 20;
const MAX_PHOTO_MB = 5;
const EMPTY = { name: "", profession: "", rating: 0, story: "", avatar: "", consent: false };
const SERVER_FIELD = { name: "name", role: "profession", rating: "rating", feedback: "story", avatar: "avatar" };

function StarInput({ value, onChange, error }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset className="field" id="story-rating" tabIndex={-1}>
      <legend className="label">Your rating</legend>
      <div className="star-input" role="radiogroup" aria-label="Rating" onPointerLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <motion.label
            key={n}
            className={`star-btn ${n <= shown ? "on" : ""}`}
            onPointerEnter={() => setHover(n)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <input
              type="radio"
              name="rating"
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            />
            <Star size={30} aria-hidden="true" />
          </motion.label>
        ))}
        <span className="star-caption" aria-hidden="true">{LABELS[shown]}</span>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
    </fieldset>
  );
}

function PhotoInput({ value, onChange, error, onError }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return onError("Please choose an image file.");
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) return onError(`Please choose a photo under ${MAX_PHOTO_MB} MB.`);
    setBusy(true);
    try {
      onChange(await resizeImage(file));
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="field" id="story-avatar" tabIndex={-1}>
      <span className="label">
        Profile photo <span className="optional">(optional)</span>
      </span>
      <div className="photo-input">
        {value ? (
          <span className="photo-preview">
            <img src={value} alt="Your selected profile photo" />
            <button type="button" onClick={() => onChange("")} aria-label="Remove photo">
              <X size={14} />
            </button>
          </span>
        ) : (
          <span className="photo-empty" aria-hidden="true">
            <ImagePlus size={22} />
          </span>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <LoaderCircle size={16} className="spin" aria-hidden="true" /> : null}
          {value ? "Change photo" : "Choose photo"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={pick} hidden />
      </div>
      {error && <p className="err" role="alert">{error}</p>}
    </div>
  );
}

export default function ShareStory() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please tell us your name.";
    if (!form.profession.trim()) e.profession = "Add your profession or what you study.";
    if (!form.rating) e.rating = "Pick a rating from 1 to 5 stars.";
    if (form.story.trim().length < MIN) e.story = `Share a little more — at least ${MIN} characters.`;
    if (!form.consent) e.consent = "Please confirm we can show your review on the website.";
    return e;
  };

  const focusFirst = (e) => document.getElementById(`story-${Object.keys(e)[0]}`)?.focus();

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setFormError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);
    setStatus("sending");
    try {
      await postReview(form);
      setSubmittedName(form.name.trim().split(" ")[0]);
      setForm(EMPTY);
      setStatus("done");
    } catch (err) {
      const fieldErrors = {};
      for (const [k, msg] of Object.entries(err.errors || {})) if (SERVER_FIELD[k]) fieldErrors[SERVER_FIELD[k]] = msg;
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length) focusFirst(fieldErrors);
      else setFormError(err.message);
      setStatus("idle");
    }
  };

  return (
    <section id="share" className="section share share-page" aria-labelledby="share-title">
      <div className="container share-inner">
        <div className="share-copy">
          <Reveal>
            <Eyebrow>Your turn</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 id="share-title" className="h2">
              Been part of the journey? <span className="grad-text">Tell your story.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">
              Your words could be the push someone else needs to unmute. Share how Unmutex has helped you.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="share-card">
          <AnimatePresence mode="wait" initial={false}>
            {status === "done" ? (
              <motion.div
                key="done"
                className="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                role="status"
              >
                <motion.span
                  className="done-ic"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, visualDuration: 0.5, delay: 0.1 }}
                >
                  <Check size={28} strokeWidth={3} />
                </motion.span>
                <h3>Thank you, {submittedName}!</h3>
                <p>Your review is live. You'll find it first in the reviews on our homepage.</p>
                <div className="done-actions">
                  <a href="/#reviews" className="btn btn-primary">
                    See your review
                  </a>
                  <button className="btn btn-ghost" onClick={() => setStatus("idle")}>
                    Write another
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <div className="row-2">
                  <div className="field">
                    <label className="label" htmlFor="story-name">Name</label>
                    <input id="story-name" className="input" autoComplete="name" maxLength={80} value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "story-name-err" : undefined} placeholder="Your full name" />
                    {errors.name && <p id="story-name-err" className="err">{errors.name}</p>}
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="story-profession">Profession</label>
                    <input id="story-profession" className="input" autoComplete="organization-title" maxLength={80} value={form.profession} onChange={set("profession")} aria-invalid={!!errors.profession} aria-describedby={errors.profession ? "story-profession-err" : undefined} placeholder="e.g. Final-year B.Tech student" />
                    {errors.profession && <p id="story-profession-err" className="err">{errors.profession}</p>}
                  </div>
                </div>

                <StarInput value={form.rating} onChange={(n) => setField("rating", n)} error={errors.rating} />
                <PhotoInput
                    value={form.avatar}
                    onChange={(v) => {
                      setField("avatar", v);
                      setErrors((e) => ({ ...e, avatar: undefined }));
                    }}
                    onError={(msg) => setErrors((e) => ({ ...e, avatar: msg }))}
                    error={errors.avatar}
                  />

                <div className="field">
                  <label className="label" htmlFor="story-story">Your story</label>
                  <textarea id="story-story" className="input" rows={5} maxLength={MAX} value={form.story} onChange={set("story")} aria-invalid={!!errors.story} aria-describedby={`story-count${errors.story ? " story-story-err" : ""}`} placeholder="Where did you start, what changed, and how does speaking feel now?" />
                  <div className="field-foot">
                    {errors.story ? <p id="story-story-err" className="err">{errors.story}</p> : <span />}
                    <span id="story-count" className="count">{form.story.length}/{MAX}</span>
                  </div>
                </div>

                <div>
                  <label className="check">
                    <input id="story-consent" type="checkbox" checked={form.consent} onChange={set("consent")} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "story-consent-err" : undefined} />
                    <span>I'm happy for Unmutex to show my name, profession, photo and review on this website.</span>
                  </label>
                  {errors.consent && <p id="story-consent-err" className="err">{errors.consent}</p>}
                </div>

                {formError && <p className="err" role="alert">{formError}</p>}

                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <><LoaderCircle size={18} className="spin" aria-hidden="true" /> Sharing…</>
                  ) : (
                    <>Share my review <Send size={17} aria-hidden="true" /></>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
