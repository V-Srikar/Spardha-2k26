<<<<<<< HEAD
import { useEffect, useState } from "react";
import eventsMap from "@/assets/events-map.jpg";

export type MapEvent = {
  id: string;
  name: string;
  tag: string;
  date: string;
  time: string;
  day: string;
  team: string;
  about: string;
  rules: string[];
  x: string;
  y: string;
  extra?: string;
  closing?: string;
  poster?: string;
  hs: [number, number, number, number][];
  teamSize: number;
};

export function EventsDoor({
  events,
  ev,
  onPick,
  onRegister,
}: {
  events: MapEvent[];
  ev: MapEvent | null;
  onPick: (e: MapEvent | null) => void;
  onRegister?: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [hov, setHov] = useState<string | null>(null);

  // DAY 1 is selected by default
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);

  useEffect(() => {
    const timer = requestAnimationFrame(() =>
      setVisible(true),
    );

    return () => cancelAnimationFrame(timer);
  }, []);

  const day1Events = events.filter((e) =>
    e.day.toLowerCase().startsWith("day 1"),
  );

  const day2Events = events.filter((e) =>
    e.day.toLowerCase().startsWith("day 2"),
  );

  const selectedEvents =
    selectedDay === 1 ? day1Events : day2Events;

  const handleEventClick = (event: MapEvent) => {
    const day = event.day
      .toLowerCase()
      .startsWith("day 1")
      ? 1
      : 2;

    setSelectedDay(day);
    onPick(event);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-10 md:px-8 md:py-16">
      {/* =========================================================
          EVENTS MAP
          ========================================================= */}

      <div
        className={`relative z-10 mx-auto max-w-6xl transition-all duration-500 ease-out ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.99] opacity-0"
        }`}
      >
        <div className="mx-auto max-w-5xl border border-primary/40 bg-black/40 p-2 shadow-2xl md:p-4">
          {/* MAP AREA */}

          <div className="relative overflow-hidden">
            {/* MAP IMAGE */}

            <img
              src={eventsMap}
              alt="SPARDHA 2K26 expedition events map"
              className={`h-auto w-full select-none transition-all duration-500 ${
                ev
                  ? "scale-[1.01] blur-[5px] brightness-[0.35]"
                  : "blur-0 brightness-100"
              }`}
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            {/* DARK OVERLAY */}

            {ev && (
              <div className="absolute inset-0 z-10 bg-black/25 backdrop-blur-[2px]" />
            )}

            {/* MAP HOTSPOTS */}

            {!ev &&
              events.map((e) =>
                e.hs.map((r, i) => (
                  <button
                    key={`${e.id}-${i}`}
                    type="button"
                    aria-label={`Explore ${e.name}`}
                    onClick={() =>
                      handleEventClick(e)
                    }
                    onMouseEnter={() =>
                      setHov(e.id)
                    }
                    onMouseLeave={() =>
                      setHov(null)
                    }
                    onFocus={() =>
                      setHov(e.id)
                    }
                    onBlur={() =>
                      setHov(null)
                    }
                    className={`ev-hs ${
                      hov === e.id ? "on" : ""
                    }`}
                    style={{
                      left: `${r[0]}%`,
                      top: `${r[1]}%`,
                      width: `${r[2]}%`,
                      height: `${r[3]}%`,
                    }}
                  />
                )),
              )}

            {/* =====================================================
                CENTER EVENT DETAILS
                ===================================================== */}

            {ev && (
              <div className="absolute inset-0 z-20 flex items-center justify-center p-3 md:p-6">
                <div
                  className="woodboard relative flex w-full max-w-3xl items-stretch border border-primary/70 bg-black/90 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  {/* CLOSE BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      onPick(null)
                    }
                    aria-label="Close event details"
                    className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center border border-primary/50 bg-black/70 text-xl leading-none text-primary transition hover:bg-primary/20"
                  >
                    ×
                  </button>

                  {/* =================================================
                      POSTER
                      ================================================= */}

                  <div className="flex w-[30%] shrink-0 items-center justify-center border-r border-primary/30 bg-black/30 p-3 md:p-4">
                    {ev.poster ? (
                      <div className="w-full overflow-hidden border border-primary/40 bg-black/50">
                        <img
                          src={ev.poster}
                          alt={`${ev.name} poster`}
                          className="aspect-[3/4] w-full object-contain"
                          loading="eager"
                        />
                      </div>
                    ) : (
                      <div className="parchment flex aspect-[3/4] w-full flex-col items-center justify-center p-3 text-center">
                        <p className="font-display text-[9px] font-bold tracking-[0.25em]">
                          SPARDHA 2K26
                        </p>

                        <p className="mt-3 font-display text-lg font-bold">
                          {ev.name}
                        </p>

                        <p className="mt-1 font-serif text-sm italic">
                          {ev.tag}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* =================================================
                      EVENT DETAILS
                      ================================================= */}

                  <div className="min-w-0 flex-1 p-4 pr-10 md:p-5 md:pr-12">
                    {/* DAY */}

                    <p className="font-display text-[10px] font-bold tracking-[0.3em] text-primary md:text-xs">
                      {ev.day} · SELECTED TERRITORY
                    </p>

                    {/* EVENT NAME */}

                    <h3 className="engraved mt-1 text-xl font-bold text-parchment md:text-2xl">
                      {ev.name}
                    </h3>

                    {/* =================================================
                        IMPORTANT EVENT DETAILS
                        ================================================= */}

                    <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                      {/* DATE */}

                      <div className="border border-primary/30 bg-primary/10 px-3 py-2.5">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          DATE
                        </p>

                        <p className="mt-1 text-sm font-bold text-parchment md:text-base">
                          {ev.date}
                        </p>
                      </div>

                      {/* TIME */}

                      <div className="border border-primary/30 bg-primary/10 px-3 py-2.5">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          TIME
                        </p>

                        <p className="mt-1 text-sm font-bold text-parchment md:text-base">
                          {ev.time}
                        </p>
                      </div>

                      {/* TEAM SIZE */}

                      <div className="border border-primary/50 bg-primary/15 px-3 py-2.5 shadow-[0_0_12px_rgba(212,175,55,0.08)]">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          TEAM SIZE
                        </p>

                        <p className="mt-1 text-sm font-bold uppercase text-parchment md:text-base">
                          {ev.teamSize === 1
                            ? "SOLO · 1 MEMBER"
                            : `${ev.teamSize} MEMBERS`}
                        </p>
                      </div>

                      {/* FORMAT */}

                      <div className="border border-primary/30 bg-primary/10 px-3 py-2.5">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          FORMAT
                        </p>

                        <p className="mt-1 text-sm font-bold uppercase text-parchment md:text-base">
                          {ev.team}
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        ABOUT
                        ================================================= */}

                    <p className="mt-3 text-xs leading-relaxed text-parchment/90 md:text-sm">
                      {ev.about}
                    </p>

                    {/* =================================================
                        EXTRA
                        ================================================= */}

                    {ev.extra && (
                      <p className="mt-2 text-xs font-bold text-primary md:text-sm">
                        {ev.extra}
                      </p>
                    )}

                    {/* =================================================
                        RULES
                        ================================================= */}

                    {ev.rules.length > 0 && (
                      <div className="mt-3">
                        <p className="font-display text-[10px] font-bold tracking-[0.25em] text-primary md:text-xs">
                          RULES
                        </p>

                        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                          {ev.rules.map(
                            (rule) => (
                              <p
                                key={rule}
                                className="text-[10px] leading-snug text-parchment/80 md:text-xs"
                              >
                                ✦ {rule}
                              </p>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* =================================================
                        CLOSING
                        ================================================= */}

                    {ev.closing && (
                      <p className="mt-2 text-[10px] font-bold tracking-[0.12em] text-primary md:text-xs">
                        {ev.closing}
                      </p>
                    )}

                    {/* =================================================
                        ACTION BUTTONS
                        ================================================= */}

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onRegister?.(ev.id)
                        }
                        className="shine min-h-9 border border-primary/60 bg-primary/20 px-4 py-2 font-display text-[10px] font-bold tracking-[0.12em] text-primary transition hover:bg-primary/30 active:scale-[0.98] md:text-xs"
                      >
                        ⚔ REGISTER
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onPick(null)
                        }
                        className="min-h-9 border border-parchment/30 px-4 py-2 font-display text-[10px] tracking-[0.12em] text-parchment transition hover:bg-parchment/10 md:text-xs"
                      >
                        ← BACK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            DAY SELECTOR
            ========================================================= */}

        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
          {/* DAY 1 */}

          <button
            type="button"
            onClick={() => {
              setSelectedDay(1);
              onPick(null);
            }}
            className={`min-h-16 border px-5 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
              selectedDay === 1
                ? "border-primary bg-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.12)]"
                : "border-primary/50 bg-background/80 hover:border-primary hover:bg-primary/10"
            }`}
          >
            <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-primary">
              FIRST DISCOVERY
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="font-display text-base font-bold tracking-wide text-parchment md:text-lg">
                DAY 1 · 12 OCTOBER 2026
              </p>

              <span className="text-lg text-primary">
                →
              </span>
            </div>
          </button>

          {/* DAY 2 */}

          <button
            type="button"
            onClick={() => {
              setSelectedDay(2);
              onPick(null);
            }}
            className={`min-h-16 border px-5 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
              selectedDay === 2
                ? "border-primary bg-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.12)]"
                : "border-primary/50 bg-background/80 hover:border-primary hover:bg-primary/10"
            }`}
          >
            <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-primary">
              BEYOND THE KNOWN
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="font-display text-base font-bold tracking-wide text-parchment md:text-lg">
                DAY 2 · 13 OCTOBER 2026
              </p>

              <span className="text-lg text-primary">
                →
              </span>
            </div>
          </button>
        </div>

        {/* =========================================================
            SELECTED DAY EVENTS
            ========================================================= */}

        <div className="mx-auto mt-6 max-w-5xl">
          <div className="mb-5 text-center">
            <p className="font-display text-[10px] font-semibold tracking-[0.4em] text-primary">
              {selectedDay === 1
                ? "DAY 1 · FIRST DISCOVERY"
                : "DAY 2 · BEYOND THE KNOWN"}
            </p>

            <h3 className="engraved mt-2 text-2xl font-bold text-parchment md:text-3xl">
              {selectedDay === 1
                ? "CHOOSE YOUR FIRST TERRITORY"
                : "CONTINUE BEYOND THE KNOWN"}
            </h3>
          </div>

          {/* =====================================================
              TWO EVENTS
              ===================================================== */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {selectedEvents.map(
              (event) => (
                <article
                  key={event.id}
                  className="woodboard flex h-full flex-col overflow-hidden border border-primary/40 shadow-2xl"
                >
                  {/* =================================================
                      EVENT POSTER
                      ================================================= */}

                  {event.poster ? (
                    <div className="relative min-h-56 overflow-hidden border-b border-primary/30 bg-black/40 md:min-h-64">
                      <img
                        src={event.poster}
                        alt={`${event.name} poster`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-primary">
                          {event.day}
                        </p>

                        <h4 className="engraved mt-1 text-2xl font-bold text-parchment md:text-3xl">
                          {event.name}
                        </h4>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center border-b border-primary/30 bg-black/30 p-6 text-center">
                      <div>
                        <p className="font-display text-[10px] font-bold tracking-[0.3em] text-primary">
                          SPARDHA 2K26
                        </p>

                        <h4 className="engraved mt-3 text-2xl font-bold text-parchment">
                          {event.name}
                        </h4>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      EVENT CONTENT
                      ================================================= */}

                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    {/* ABOUT */}

                    <p className="text-sm font-semibold leading-relaxed text-parchment/90 md:text-base">
                      {event.about}
                    </p>

                    {/* =================================================
                        HIGHLIGHTED EVENT INFORMATION
                        ================================================= */}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {/* DATE */}

                      <div className="border border-primary/30 bg-primary/10 px-3 py-3">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          DATE
                        </p>

                        <p className="mt-1 text-sm font-bold text-parchment md:text-base">
                          {event.date}
                        </p>
                      </div>

                      {/* TIME */}

                      <div className="border border-primary/30 bg-primary/10 px-3 py-3">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          TIME
                        </p>

                        <p className="mt-1 text-sm font-bold text-parchment md:text-base">
                          {event.time}
                        </p>
                      </div>

                      {/* TEAM SIZE */}

                      <div className="border border-primary/50 bg-primary/15 px-3 py-3 shadow-[0_0_14px_rgba(212,175,55,0.08)]">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          TEAM SIZE
                        </p>

                        <p className="mt-1 text-sm font-bold uppercase text-parchment md:text-base">
                          {event.teamSize === 1
                            ? "SOLO · 1 MEMBER"
                            : `${event.teamSize} MEMBERS`}
                        </p>
                      </div>

                      {/* FORMAT */}

                      <div className="border border-primary/30 bg-primary/10 px-3 py-3">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                          FORMAT
                        </p>

                        <p className="mt-1 text-sm font-bold uppercase text-parchment md:text-base">
                          {event.team}
                        </p>
                      </div>

                      {/* EXTRA DETAIL */}

                      {event.extra && (
                        <div className="col-span-2 border border-primary/25 bg-primary/5 px-3 py-3">
                          <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary md:text-[10px]">
                            DETAIL
                          </p>

                          <p className="mt-1 text-sm font-semibold leading-relaxed text-parchment/90 md:text-base">
                            {event.extra}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        RULES
                        ================================================= */}

                    <div className="mt-5">
                      <p className="font-display text-[10px] font-semibold tracking-[0.25em] text-primary md:text-xs">
                        RULES
                      </p>

                      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-parchment/90 md:text-[15px]">
                        {event.rules.map(
                          (rule) => (
                            <li key={rule}>
                              ✦ {rule}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* =================================================
                        CLOSING
                        ================================================= */}

                    {event.closing && (
                      <p className="mt-4 font-display text-xs font-semibold tracking-[0.15em] text-primary md:text-sm">
                        {event.closing}
                      </p>
                    )}

                    {/* =================================================
                        REGISTER
                        ================================================= */}

                    <div className="mt-auto pt-6">
                      <button
                        type="button"
                        onClick={() =>
                          onRegister?.(
                            event.id,
                          )
                        }
                        className="shine min-h-12 w-full border border-primary/60 bg-primary/20 px-5 py-3 font-display text-xs font-bold tracking-[0.15em] text-primary transition hover:bg-primary/30 active:scale-[0.98] md:text-sm"
                      >
                        ⚔ REGISTER FOR MISSION
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
=======
import { useEffect, useRef, useState } from "react";
import doorImg from "@/assets/journey-door.jpg";
import eventsMap from "@/assets/events-map.jpg";

export type MapEvent = {
  id: string; name: string; tag: string; date: string; time: string; day: string; team: string;
  about: string; rules: string[]; x: string; y: string; extra?: string; closing?: string;
  poster?: string;
  hs: [number, number, number, number][]; // clickable rects on the map image: [left%, top%, w%, h%]
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** Scroll-driven scene: a vine-covered stone gate splits open, light floods out, and the expedition map arrives through it. */
export function EventsDoor({ events, ev, onPick, onRegister }: { events: MapEvent[]; ev: MapEvent | null; onPick: (e: MapEvent | null) => void; onRegister?: (id: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const doors = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);
  const [hov, setHov] = useState<string | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const w = wrap.current;
      if (!w) return;
      const r = w.getBoundingClientRect();
      const p = reduce ? 1 : clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      const open = smooth(seg(p, 0.1, 0.62));
      const mapIn = smooth(seg(p, 0.32, 0.8));
      const glowOp = smooth(seg(p, 0.1, 0.38)) * (1 - smooth(seg(p, 0.6, 0.92)));
      if (left.current) left.current.style.transform = `translate3d(${-open * 102}%,0,0)`;
      if (right.current) right.current.style.transform = `translate3d(${open * 102}%,0,0)`;
      if (doors.current) {
        doors.current.style.transform = `scale(${1 + open * 0.32})`;
        doors.current.style.opacity = String(1 - smooth(seg(p, 0.72, 0.86)));
        doors.current.style.visibility = p > 0.9 ? "hidden" : "visible";
      }
      if (glow.current) { glow.current.style.opacity = String(glowOp); glow.current.style.transform = `scale(${0.4 + open * 1.6})`; }
      if (dim.current) dim.current.style.opacity = String(open * 0.9);
      if (box.current) {
        box.current.style.opacity = String(mapIn);
        box.current.style.transform = `scale(${0.8 + 0.2 * mapIn})`;
        box.current.style.filter = mapIn >= 1 ? "none" : `blur(${(1 - mapIn) * 10}px) brightness(${1 + (1 - mapIn) * 1.3})`;
        box.current.style.pointerEvents = mapIn > 0.92 ? "auto" : "none";
      }
      if (hint.current) hint.current.style.opacity = String(1 - seg(p, 0, 0.07));
    };
    const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => { window.removeEventListener("scroll", tick); window.removeEventListener("resize", tick); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!ev) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onPick(null);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [ev, onPick]);

  const half = (side: "l" | "r") => (
    <div ref={side === "l" ? left : right} className="absolute top-0 h-full w-1/2 overflow-hidden will-change-transform" style={{ [side === "l" ? "left" : "right"]: 0 }}>
      <img src={doorImg} alt="" aria-hidden className="absolute top-0 h-full w-[200%] max-w-none object-cover" style={{ [side === "l" ? "left" : "right"]: 0 }} draggable={false} />
    </div>
  );

  return (
    <div ref={wrap} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 isolate flex h-screen items-center justify-center overflow-hidden">
        <div ref={dim} className="absolute inset-0" style={{ opacity: 0, background: "radial-gradient(ellipse at center, oklch(.2 .02 60 / 35%), oklch(.07 .01 60 / 92%))" }} />
        <div ref={glow} className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ opacity: 0, background: "radial-gradient(circle, oklch(.97 .09 90 / 90%) 0%, oklch(.85 .13 80 / 55%) 18%, transparent 52%)" }} />

        <div ref={box} className="relative will-change-transform" style={{ opacity: 0, width: "min(94vw, 1180px, calc((100svh - 5.5rem) * 1.3907))", aspectRatio: "776 / 558", pointerEvents: "none" }}>
          <div className="absolute inset-0 transition-[transform,filter] duration-[1200ms] ease-out" style={ev ? { transform: "scale(1.3)", transformOrigin: `${ev.x} ${ev.y}`, filter: "brightness(.55) blur(2px)" } : undefined}>
            <img src={eventsMap} alt="Illustrated expedition map: Day 1 — Code Dunes and Prompt the Unseen; Day 2 — The Cursed Seas and The Last Signal" className="h-full w-full select-none shadow-2xl" draggable={false} />
            {!ev && events.map((e) => e.hs.map((r, i) => (
              <button key={`${e.id}${i}`} aria-label={i === 0 ? `Explore ${e.name}` : undefined} aria-hidden={i === 0 ? undefined : true} tabIndex={i === 0 ? 0 : -1}
                onClick={() => onPick(e)} onMouseEnter={() => setHov(e.id)} onMouseLeave={() => setHov(null)} onFocus={() => setHov(e.id)} onBlur={() => setHov(null)}
                className={`ev-hs ${hov === e.id ? "on" : ""}`} style={{ left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%` }} />
            )))}
          </div>
        </div>

        {!ev && (
          <div className="absolute inset-x-3 bottom-3 z-10 grid grid-cols-2 gap-2 md:hidden">
            {events.map((e) => <button key={e.id} onClick={() => onPick(e)} className="border border-primary/60 bg-background/80 px-2 py-2 font-display text-[10px] font-semibold tracking-[0.15em] text-primary">{e.name.toUpperCase()}</button>)}
          </div>
        )}

        {ev && (
          <div className="animate-rise absolute inset-0 z-30 flex items-center justify-center bg-ink/50 p-3 md:p-8">
            <div className="woodboard grid max-h-full w-full max-w-4xl gap-6 overflow-auto p-5 md:grid-cols-[220px_1fr] md:p-8">
              {ev.poster ? (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-primary/40 shadow-2xl">
                  <img src={ev.poster} alt={`${ev.name} poster`} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="parchment flex aspect-[3/4] flex-col items-center justify-center p-4 text-center" style={{ transform: "rotate(-2deg)" }}>
                  <p className="font-display text-[10px] font-bold tracking-[0.3em]">SPARDHA 2K26</p>
                  <p className="mt-4 font-display text-2xl font-bold">{ev.name}</p>
                  <p className="mt-2 font-serif text-lg font-semibold italic">{ev.tag}</p>
                </div>
              )}
              <div className="text-parchment">
                <p className="font-display text-xs font-semibold tracking-[0.3em] text-primary legible">{ev.day}</p>
                <h3 className="engraved mt-1 text-3xl font-bold">{ev.name}</h3>
                <p className="mt-2 text-sm font-medium text-parchment legible">{ev.date} · {ev.time} · VVIT University · Team: {ev.team}</p>
                {ev.extra && <p className="mt-1 text-sm font-semibold tracking-wide text-primary legible">{ev.extra}</p>}
                <p className="mt-4 font-serif text-xl font-semibold leading-snug">{ev.about}</p>
                <ul className="mt-4 space-y-1.5 text-sm font-medium text-parchment">{ev.rules.map((r) => <li key={r}>✦ {r}</li>)}</ul>
                {ev.closing && <p className="mt-4 font-display text-sm font-semibold tracking-[0.2em] text-primary legible">{ev.closing}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="shine border border-primary/60 bg-primary/20 px-5 py-2 font-display text-xs font-semibold tracking-[0.25em] text-primary">
                    REGISTRATIONS OPENING SOON
                  </div>
                  <button onClick={() => onPick(null)} className="border border-parchment/40 px-5 py-2 font-display text-xs tracking-[0.25em] text-parchment hover:bg-parchment/10">BACK TO EXPEDITIONS</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={doors} aria-hidden className="pointer-events-none absolute inset-0 z-20 will-change-transform" style={{ transformOrigin: "50% 50%" }}>
          {half("l")}{half("r")}
        </div>
        <p ref={hint} className="legible pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 font-display text-[11px] font-semibold tracking-[0.5em] text-parchment">SCROLL TO OPEN THE GATE ↓</p>
      </div>
    </div>
  );
}
>>>>>>> 87f7d195d037968f5198ad98853b6babb8c139b6
