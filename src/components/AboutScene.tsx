import { useEffect, useRef } from "react";
import "@/about.css";

export function AboutScene() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          el.classList.add("is-in");
        } else {
          el.classList.remove("is-in");
        }
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={root} className="about-simple" aria-labelledby="about-title">
      {/* Dark readability layer over the EXISTING website background */}
      <div className="about-overlay" aria-hidden="true" />

      {/* Main About panel */}
      <div className="about-panel">
        <div className="about-border">
          <div className="about-content">
            {/* Chamber heading */}
            <div className="about-chamber">
              <span />
              CHAMBER I
              <span />
            </div>

            {/* Main heading */}
            <h2 id="about-title">ABOUT SPARDHA</h2>

            <div className="about-diamond">◆</div>

            {/* Subtitle */}
            <div className="about-subtitle">SPARDHA 2K26 — THE UNCHARTED</div>

            {/* Description */}
            <div className="about-description">
              <p>
                <span className="about-drop">S</span>
                tep beyond the familiar and enter <em>The Uncharted</em> — a realm where technology
                becomes a <em>journey of discovery</em>, ideas become{" "}
                <em>unexplored territories</em>, and every challenge is a path waiting to be found.
              </p>
            </div>

            <div className="about-divider" />

            {/* Quote */}
            <p className="about-quote">
              EXPLORE THE UNKNOWN. DISCOVER NEW POSSIBILITIES. CREATE
              <br />
              WHAT HAS NEVER BEEN CHARTED.
            </p>

            <div className="about-divider" />

            {/* Statistics */}
            <div className="about-stats">
              <div className="about-stat">
                <strong>02</strong>
                <span>DAYS</span>
              </div>

              <div className="about-stat">
                <strong>∞</strong>
                <span>POSSIBILITIES</span>
              </div>

              <div className="about-stat">
                <strong>01</strong>
                <span>
                  UNCHARTED
                  <br />
                  JOURNEY
                </span>
              </div>

              <div className="about-stat">
                <strong>0</strong>
                <span>LIMITS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
