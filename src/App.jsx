import { useEffect } from "react";
import { startSmoothScroll, scrollToHash } from "./lib/smooth.js";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import About from "./components/About.jsx";
import Activities from "./components/Activities.jsx";
import Resources from "./components/Resources.jsx";
import VideoTestimonials from "./components/VideoTestimonials.jsx";
import Reviews from "./components/Reviews.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll();
    const hash = window.location.hash;
    let id;
    if (hash.length > 1) id = setTimeout(() => scrollToHash(hash), 350);
    return () => {
      clearTimeout(id);
      stop();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Reviews />
        <Marquee />
        <HowItWorks />
        <About />
        <Activities />
        <Resources />
        <VideoTestimonials />
      </main>
      <Footer />
    </>
  );
}
