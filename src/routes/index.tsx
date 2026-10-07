import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { initSectionReveal } from "@/lib/section-reveal";

import cave from "@/assets/cave.jpg";
import logo from "@/assets/spardha-logo.png";
import acm from "@/assets/acm-logo.png";
import campusMap from "@/assets/campus-map.jpg";

import { initTextReveal } from "@/lib/text-reveal";

import { SpotEvents } from "@/components/SpotEvents";
import { ContactSection } from "@/components/ContactSection";
import { AboutScene } from "@/components/AboutScene";
import { EventsDoor, type MapEvent } from "@/components/EventsDoor";
import { RegistrationModal } from "@/components/RegistrationModal";

import codePoster from "@/assets/main/code-dunes.jpg";
import unseenPoster from "@/assets/main/prompt-the-unknown.jpg";
import seasPoster from "@/assets/main/the-cursed-seas.jpg";
import signalPoster from "@/assets/main/the-last-signal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "SPARDHA 2K26 — The Uncharted | VVITU Tech Fest",
      },
      {
        name: "description",
        content:
          "Spardha 2K26 — The Uncharted. Annual techno fest of VVIT University, presented by ACM VVITU. October 12–13, 2026.",
      },
      {
        property: "og:title",
        content: "SPARDHA 2K26 — The Uncharted",
      },
      {
        property: "og:description",
        content:
          "Explore the unknown. The annual techno fest of VVIT University, Oct 12–13, 2026.",
      },
    ],
  }),
  component: Index,
});

const NAV = ["home", "about", "events", "campus", "contact"] as const;

type Ev = MapEvent;

const EVENTS: Ev[] = [
  {
    id: "code",
    name: "Code Dunes",
    tag: "Competitive programming challenge",
    date: "12 October 2026",
    time: "9:00 AM – 1:00 PM",
    day: "Day 1 · First Discovery",
    team: "Individual (1)",
    teamSize: 1,
    extra: "Event 1 · Duration: 90 Minutes",
    closing: "",
    x: "39%",
    y: "29%",
    poster: codePoster,
    hs: [
      [7.5, 11.6, 25, 26.3],
      [33, 21, 12.4, 14.8],
    ],
    about:
      "Code Dunes is a competitive programming challenge featuring 5 algorithmic problems of increasing difficulty. Participants compete individually on HackerRank, with submissions automatically evaluated against hidden test cases and scores reflected on the live leaderboard.",
    rules: [
      "Solve all 5 challenges within 90 minutes.",
      "3 Medium and 2 Hard problems.",
      "Any programming language supported by HackerRank is allowed.",
      "Mobile phone usage is prohibited.",
      "Single round; final rankings are based on score and performance.",
    ],
  },

  {
    id: "unseen",
    name: "Prompt the Unknown",
    tag: "Generative AI Challenge",
    date: "12 October 2026",
    time: "12:00 PM – 3:00 PM",
    day: "Day 1 · First Discovery",
    team: "2 members (exactly 2)",
    teamSize: 2,
    extra: "Event 2 · Rounds: 3 × 40 Minutes",
    closing: "",
    x: "39%",
    y: "56%",
    poster: unseenPoster,
    hs: [
      [8.5, 39.8, 23.2, 27],
      [33, 48, 11.9, 15.8],
    ],
    about:
      "A Generative AI challenge testing AI knowledge, prompt engineering, creativity, and innovation through three rounds—knowledge, AI image generation, and AI video creation.",
    rules: [
      "Each team must have exactly 2 participants.",
      "Bring your own smartphone or laptop.",
      "Complete each round within the allotted time.",
      "Only shortlisted teams advance.",
      "Organizers' decisions are final.",
    ],
  },

  {
    id: "seas",
    name: "The Cursed Seas",
    tag: "Dare the Depths. Claim the Doom.",
    date: "13 October 2026",
    time: "9:00 AM – 1:00 PM",
    day: "Day 2 · Beyond the Known",
    team: "Individual",
    teamSize: 1,
    extra: "Event 1 · Duration: 2 Hours",
    closing: "Think. Solve. Survive. Conquer the Seas.",
    x: "63%",
    y: "30%",
    poster: seasPoster,
    hs: [
      [70.2, 11.1, 23.8, 26.5],
      [55.2, 21.9, 15.2, 17.2],
    ],
    about:
      "A pirate-themed technical adventure combining puzzles, logic, and programming challenges. Solve each challenge, unlock the next stage, and survive the journey to discover the hidden treasure.",
    rules: [
      "Complete each challenge to unlock the next stage.",
      "Wrong answers cost a life/attempt.",
      "No skipping or bypassing challenges.",
      "Follow the instructions on each challenge screen.",
      "Complete the journey to claim the treasure.",
    ],
  },

  {
    id: "signal",
    name: "The Last Signal",
    tag: "Technical clue-solving expedition",
    date: "13 October 2026",
    time: "12:00 PM – 3:00 PM",
    day: "Day 2 · Beyond the Known",
    team: "2 members",
    teamSize: 2,
    extra: "Event 2 · Rounds: 20 Min · 10 Min · 30 Min",
    closing: "",
    x: "65%",
    y: "62%",
    poster: signalPoster,
    hs: [
      [71.8, 42.7, 24.2, 26.9],
      [59, 53.8, 11.6, 17.6],
    ],
    about:
      "Navigate the unknown by solving technical clues, identifying routes, and reaching the destination. The final round combines grid-solving and system challenges, testing teamwork, logic, and communication.",
    rules: [
      "Start at SOURCE and follow clues to reach DEST.",
      "Identify the correct nodes and backtrack when instructed.",
      "In Round 3, one participant solves grids while the other solves system questions.",
      "Complete each round within the allotted time.",
      "Organizers' decisions are final.",
    ],
  },
];

const SPOTS: [string, number, number, number, number][] = [
  ["Ground", 15.6, 27.3, 52.7, 7.2],
  ["Sports Ground", 15.6, 37.1, 12.7, 13.7],
  ["Viva Auditorium", 72.8, 29.3, 11.7, 5.5],
  ["B Block", 31.7, 37.1, 9.8, 5.9],
  ["OAT", 41.8, 37.1, 16.3, 3.8],
  ["C Block", 58.4, 37.1, 9.2, 6.2],
  ["Stage", 45.1, 43.0, 9.6, 1.9],
  ["Central Block", 44.4, 45.1, 11.2, 5.1],
  ["A Block", 32.2, 50.8, 9.3, 6.4],
  ["D Block", 58.4, 50.8, 9.2, 6.4],
  ["University Block", 15.6, 56.5, 12.7, 10.7],
  ["New Block", 32.2, 60.2, 38.9, 8.5],
  ["Bus Ground", 12.5, 71.3, 11.7, 9.4],
];

/* -------------------------------------------------------------------------- */
/* NAV */
/* -------------------------------------------------------------------------- */

function Nav({
  active,
  onRegister,
}: {
  active: string;
  onRegister: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let ticking = false;

    const f = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };

    f();

    window.addEventListener("scroll", f, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", f);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";

    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
      }
    };

    window.addEventListener("keydown", k);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [menu]);

  return (
    <header
      className={`site-nav ${
        scrolled || menu ? "is-scrolled" : ""
      } ${menu ? "is-open" : ""}`}
    >
      <div className="site-nav__in">
        <div className="site-nav__brand">
  <a
    href="#home"
    aria-label="VVITU ACM"
  >
    <img
      src={acm}
      alt="VVITU ACM"
      className="site-nav__acm"
    />
  </a>
</div>

        <nav
          className="site-nav__links"
          aria-label="Primary"
        >
          {NAV.map((n) => (
            <a
              key={n}
              href={`#${n}`}
              aria-current={
                active === n
                  ? "true"
                  : undefined
              }
              className={`site-nav__link ${
                active === n
                  ? "is-active"
                  : ""
              }`}
            >
              {n.toUpperCase()}
            </a>
          ))}
        </nav>

        <div className="site-nav__right">
          <button
            type="button"
            onClick={onRegister}
            className="site-nav__cta"
          >
            REGISTER
          </button>

          <button
            type="button"
            className="site-nav__burger"
            aria-label={
              menu
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={menu}
            onClick={() =>
              setMenu((m) => !m)
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="site-nav__panel">
        {NAV.map((n) => (
          <a
            key={n}
            href={`#${n}`}
            onClick={() =>
              setMenu(false)
            }
            className={`site-nav__plink ${
              active === n
                ? "is-active"
                : ""
            }`}
          >
            {n.toUpperCase()}
          </a>
        ))}

        <button
          type="button"
          onClick={() => {
            onRegister();
            setMenu(false);
          }}
          className="site-nav__cta site-nav__cta--wide"
        >
          REGISTER
        </button>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* CHROME */
/* -------------------------------------------------------------------------- */

function Chrome() {
  const bar = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const h =
          document.documentElement
            .scrollHeight -
          window.innerHeight;

        if (bar.current) {
          bar.current.style.transform = `scaleX(${
            h > 0
              ? window.scrollY / h
              : 0
          })`;
        }

        setShow(window.scrollY > 900);

        ticking = false;
      });
    };

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll,
      );
    };
  }, []);

  return (
    <>
      <div
        ref={bar}
        className="scroll-progress pointer-events-none"
      />

      <button
        type="button"
        aria-label="Back to top"
        data-show={show}
        className="to-top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        ↑
      </button>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* RAIL */
/* -------------------------------------------------------------------------- */

function Rail({
  active,
}: {
  active: string;
}) {
  return (
    <div className="fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-center gap-6 md:flex pointer-events-auto">
      <span className="absolute inset-y-[-1.5rem] w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent pointer-events-none" />

      {NAV.map((n) => (
        <a
          key={n}
          href={`#${n}`}
          aria-label={n}
          className="group relative flex h-4 w-4 items-center justify-center"
        >
          <span
            className={`rail-dot ${
              active === n
                ? "is-on"
                : ""
            }`}
          />

          <span className="rail-tip">
            {n.toUpperCase()}
          </span>
        </a>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE */
/* -------------------------------------------------------------------------- */

function Index() {
  const [
    registrationOpen,
    setRegistrationOpen,
  ] = useState(false);

  const [
    registrationEventId,
    setRegistrationEventId,
  ] = useState<string | null>(null);

  const loaded = true;

  const [active, setActive] =
    useState("home");

  const [ev, setEv] =
    useState<Ev | null>(null);

  const [place, setPlace] =
    useState<string | null>(null);

  const [zoom, setZoom] =
    useState(false);

  const homeImage =
    useRef<HTMLImageElement>(null);

  const heroContent =
    useRef<HTMLDivElement>(null);

  const scrollCue =
    useRef<HTMLDivElement>(null);

  const sign =
    useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------------- */
  /* TEXT SCROLL REVEAL                                                     */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!loaded) return;

    const cleanup =
      initTextReveal();

    return cleanup;
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const cleanup =
      initSectionReveal();

    return cleanup;
  }, [loaded]);

  /* ---------------------------------------------------------------------- */
  /* HOME SCROLL EFFECT                                                     */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let raf = 0;

    const updateHome = () => {
      raf = 0;

      const y = Math.min(
        1,
        window.scrollY / 900,
      );

      if (homeImage.current) {
        homeImage.current.style.transform =
          `scale(${1 + y * 0.18})`;
      }

      if (heroContent.current) {
        heroContent.current.style.opacity =
          String(1 - y * 1.6);

        heroContent.current.style.transform =
          `translate3d(0, ${-y * 80}px, 0)`;
      }

      if (scrollCue.current) {
        scrollCue.current.style.opacity =
          String(
            Math.max(0, 1 - y * 4),
          );
      }

      if (sign.current) {
        sign.current.style.opacity =
          String(
            Math.max(0, 1 - y * 2.2),
          );
      }
    };

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(
          updateHome,
        );
      }
    };

    updateHome();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true },
    );

    window.addEventListener(
      "resize",
      onScroll,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll,
      );

      window.removeEventListener(
        "resize",
        onScroll,
      );

      cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* ACTIVE NAVIGATION                                                      */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const obs =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                setActive(
                  entry.target.id,
                );
              }
            },
          );
        },
        {
          rootMargin:
            "-45% 0px -45% 0px",
          threshold: 0,
        },
      );

    NAV.forEach((n) => {
      const el =
        document.getElementById(n);

      if (el) {
        obs.observe(el);
      }
    });

    return () =>
      obs.disconnect();
  }, []);

  return (
    <main className="bg-background text-foreground">

      {/* ---------------------------------------------------------------- */}
      {/* NAVIGATION                                                        */}
      {/* ---------------------------------------------------------------- */}

      <Nav
        active={active}
        onRegister={() => {
          setRegistrationEventId(
            null,
          );
          setRegistrationOpen(true);
        }}
      />

      <Chrome />

      <Rail active={active} />

      {/* ---------------------------------------------------------------- */}
      {/* HOME                                                             */}
      {/* ---------------------------------------------------------------- */}

      <section
        id="home"
        className="relative h-[180vh] animate-crack"
      >
        <div className="sticky top-0 h-screen overflow-hidden">

          <img
            ref={homeImage}
            src={cave}
            alt="Ancient cave opening onto a misty valley of temples"
            width={1920}
            height={1088}
            className="bg-photo absolute inset-0 h-full w-full object-cover pointer-events-none"
            style={{
              transform: "scale(1)",
              transformOrigin:
                "55% 50%",
              willChange: "transform",
            }}
          />

          <div className="vignette pointer-events-none absolute inset-0" />

          <div className="rays pointer-events-none" />

          <div
            ref={heroContent}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{
              opacity: 1,
              transform:
                "translate3d(0,0,0)",
              willChange:
                "opacity, transform",
            }}
          >
            <div className="hero-veil pointer-events-none absolute inset-0" />

            <p className="animate-rise presents relative font-display text-[10px] tracking-[0.35em] md:text-xs">
              ACM VVITU STUDENT CHAPTER PRESENTS
            </p>

            {/* ---------------------------------------------------------- */}
            {/* CORRECTED SPARDHA LOGO                                    */}
            {/* ---------------------------------------------------------- */}

            <h1 className="animate-rise relative mt-4">
              <span className="mx-auto block w-[min(80vw,620px)]">
                <img
                  src={logo}
                  alt="Spardha 2K26"
                  width={1200}
                  height={721}
                  className="block w-full"
                  style={{
                    mixBlendMode:
                      "screen",
                    background:
                      "transparent",
                  }}
                />
              </span>
            </h1>

            <h2
              className="hero-sub animate-rise legible relative mt-2 font-display font-bold text-parchment"
              style={{
                animationDelay: ".3s",
              }}
            >
              THE UNCHARTED
            </h2>

            <p
              className="animate-rise relative mt-6 max-w-3xl"
              style={{
                animationDelay: ".6s",
              }}
            >
              <span className="fest-script">
                The Annual Techno Fest of
              </span>

              <span className="fest-univ">
                Vasireddy Venkatadri
                International Technological
                University
              </span>
            </p>
          </div>

          <div
            ref={scrollCue}
            className="scroll-cue pointer-events-none absolute bottom-10 left-8 hidden flex-col items-center gap-2 font-display text-[10px] font-semibold tracking-[0.4em] text-parchment legible md:flex"
            style={{
              opacity: 1,
            }}
          >
            <span>SCROLL</span>
            <span className="h-10 w-px bg-primary" />
          </div>

          <div
            ref={sign}
            className="sign pointer-events-none"
            style={{
              opacity: 1,
            }}
          >
            <div className="woodboard sign-board">
              <p className="font-display font-semibold text-parchment/90 legible">
                EXPEDITION DATES
              </p>

              <p className="font-display font-bold tracking-widest text-parchment legible">
                OCT 12
                <sup>th</sup> &amp; 13
                <sup>th</sup>
              </p>
            </div>

            <span className="sign-post" />
          </div>
        </div>

        <div
          className="home-about-transition pointer-events-none"
          aria-hidden="true"
        >
          <div className="transition-fog pointer-events-none" />
          <div className="transition-glow pointer-events-none" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* ABOUT                                                            */}
      {/* ---------------------------------------------------------------- */}

      <AboutScene />

      {/* ---------------------------------------------------------------- */}
      {/* EVENTS                                                           */}
      {/* ---------------------------------------------------------------- */}

      <section
        id="events"
        className="relative py-28"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="scrim mx-auto max-w-3xl px-6 py-8 text-center">
            <p className="font-display text-xs font-semibold tracking-[0.5em] text-primary chapter">
              CHAMBER II
            </p>

            <h2 className="engraved mt-3 text-5xl font-bold md:text-7xl">
              THE EXPEDITION MAP
            </h2>

            <p className="mt-3 font-serif text-xl font-semibold italic text-parchment">
              Choose a territory. Begin your discovery.
            </p>
          </div>
        </div>

        <EventsDoor
          events={EVENTS}
          ev={ev}
          onPick={setEv}
          onRegister={(id) => {
            setRegistrationEventId(
              id,
            );
            setRegistrationOpen(
              true,
            );
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="scrim mx-auto mt-28 max-w-3xl px-6 py-8 text-center">
            <h2 className="engraved text-4xl font-bold md:text-6xl">
              SPOT EVENTS
            </h2>

            <p className="mx-auto mt-4 max-w-xl font-serif text-xl font-semibold text-parchment">
              On-the-spot challenges and surprises
              await! Navigate through our
              interactive gallery to discover the
              exciting spot events.
            </p>

            <SpotEvents />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CAMPUS                                                           */}
      {/* ---------------------------------------------------------------- */}

      <section
        id="campus"
        className="relative overflow-hidden py-28"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          <div className="scrim mx-auto max-w-3xl px-6 py-8">
            <p className="font-display text-xs font-semibold tracking-[0.5em] text-primary chapter">
              CHAMBER III
            </p>

            <h2 className="engraved mt-3 text-5xl font-bold md:text-7xl">
              THE CAMPUS
            </h2>

            <p className="mt-3 font-serif text-xl font-semibold italic text-parchment">
              {place
                ? `Arrived at ${place}`
                : "Select a landmark to travel there."}
            </p>
          </div>

          <div className="cm-wrap mx-auto mt-10 text-left">
            <div className="campus-frame relative overflow-hidden">
              <img
                src={campusMap}
                alt="Illustrated navigation map of the VVIT University campus"
                loading="lazy"
                decoding="async"
                className="block h-auto w-full pointer-events-none"
              />

              {SPOTS.map(
                ([n, x, y, w, h]) => (
                  <button
                    type="button"
                    key={n}
                    aria-label={n}
                    onClick={() =>
                      setPlace(
                        n === place
                          ? null
                          : n,
                      )
                    }
                    className={`hs ${
                      place === n
                        ? "is-on"
                        : ""
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: `${w}%`,
                      height: `${h}%`,
                    }}
                  >
                    <span className="hs-tag">
                      {n}
                    </span>
                  </button>
                ),
              )}
            </div>

            <div className="scrim px-6 py-8">
              <h3 className="card-title font-display font-semibold tracking-[0.3em] text-primary">
                LANDMARKS
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {SPOTS.map(([n]) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() =>
                      setPlace(
                        n === place
                          ? null
                          : n,
                      )
                    }
                    className={`border px-3 py-2 text-left font-display text-[11px] font-semibold tracking-[0.15em] ${
                      place === n
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background/60 text-parchment"
                    }`}
                  >
                    {n.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setZoom(true)
                }
                className="shine mt-6 border border-primary/70 bg-background/60 px-5 py-2 font-display text-xs font-semibold tracking-[0.3em] text-primary"
              >
                VIEW FULL MAP
              </button>
            </div>
          </div>

          {place && (
            <button
              type="button"
              onClick={() =>
                setPlace(null)
              }
              className="mt-6 border border-parchment/40 px-5 py-2 font-display text-xs tracking-[0.25em] text-parchment"
            >
              CLEAR SELECTION
            </button>
          )}
        </div>

        {zoom && (
          <div
            className="reg-back"
            onClick={() =>
              setZoom(false)
            }
          >
            <img
              src={campusMap}
              alt="Campus map, full view"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CONTACT                                                          */}
      {/* ---------------------------------------------------------------- */}

      <ContactSection />

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                           */}
      {/* ---------------------------------------------------------------- */}

      <footer
        id="footer"
        className="relative overflow-hidden pt-40"
      >
        <div className="scrim relative z-10 mx-auto max-w-5xl px-4 pb-10 pt-10 text-center">
          <h2 className="engraved text-3xl font-bold md:text-5xl">
            THE EXPEDITION IS COMPLETE.
          </h2>

          <h2 className="mt-2 font-display text-xl font-semibold tracking-[0.4em] text-parchment legible md:text-3xl">
            THE UNKNOWN REMAINS.
          </h2>

          <p className="mt-14 font-display font-semibold tracking-[0.3em] text-primary">
            VVITU ACM / SPARDHA 2K26
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-5 font-display text-[11px] font-semibold tracking-[0.25em] text-parchment/90">
            {NAV.map((n) => (
              <a
                key={n}
                href={`#${n}`}
                className="hover:text-parchment"
              >
                {n.toUpperCase()}
              </a>
            ))}

            <span className="text-primary/90">
              REGISTRATIONS OPENING SOON
            </span>
          </div>

          <p className="mt-6 text-sm font-medium text-parchment/90">
            acm.vvit@gmail.com · +91 78426 71226
          </p>

          <p className="text-sm font-medium text-parchment/90">
            Vasireddy Venkatadri International
            Technological University, Nambur,
            Guntur — 522508
          </p>

          <p className="mt-6 text-xs text-parchment/75">
            VVITU ACM Student Chapter · © 2026
            VVITU ACM Student Chapter
          </p>
        </div>

        <div className="h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </footer>

      {/* ---------------------------------------------------------------- */}
      {/* REGISTRATION                                                     */}
      {/* ---------------------------------------------------------------- */}

      <RegistrationModal
        open={registrationOpen}
        eventId={registrationEventId}
        events={EVENTS}
        onClose={() => {
          setRegistrationOpen(false);
          setRegistrationEventId(
            null,
          );
        }}
      />
    </main>
  );
}