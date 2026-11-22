import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { startSmoothScroll } from "./lib/smooth.js";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import "./styles.css";
import "./pages.css";
import "./theme.css";

function Page({ children }) {
  useEffect(() => startSmoothScroll(), []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

export function mountPage(content) {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <Page>{content}</Page>
      </MotionConfig>
    </StrictMode>
  );
}
