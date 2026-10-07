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
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setVisible(true);
    });

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
      <div
        className={`relative z-10 mx-auto max-w-6xl transition-all duration-500 ease-out ${visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.99] opacity-0"
          }`}
      >
        {/* MAP */}
        <div className="mx-auto max-w-5xl border border-primary/40 bg-black/40 p-2 shadow-2xl md:p-4">
          <div className="relative overflow-hidden">
            <img
              src={eventsMap}
              alt="SPARDHA 2K26 expedition events map"
              className={`h-auto w-full select-none transition-all duration-500 ${ev
                  ? "scale-[1.01] blur-[5px] brightness-[0.3]"
                  : "blur-0 brightness-100"
                }`}
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            {/* DARK OVERLAY */}
            {ev && (
              <div className="absolute inset-0 z-10 bg-black/45 backdrop-blur-[2px]" />
            )}

            {/* MAP HOTSPOTS */}
            {!ev &&
              events.map((e) =>
                e.hs.map((r, i) => (
                  <button
                    key={`${e.id}-${i}`}
                    type="button"
                    aria-label={`Explore ${e.name}`}
                    onClick={() => handleEventClick(e)}
                    onMouseEnter={() => setHov(e.id)}
                    onMouseLeave={() => setHov(null)}
                    onFocus={() => setHov(e.id)}
                    onBlur={() => setHov(null)}
                    className={`ev-hs ${hov === e.id ? "on" : ""
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
                EVENT POPUP
               ===================================================== */}
            {ev && (
              <div className="absolute inset-0 z-20 flex items-center justify-center p-2 sm:p-4 md:p-6">
                <div
                  className="
                    relative
                    w-full
                    max-w-4xl
                    overflow-hidden
                    border border-primary/70
                    bg-[#100d09]
                    shadow-[0_0_45px_rgba(0,0,0,0.95)]
                  "
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* CORNER DETAILS */}
                  <div className="pointer-events-none absolute left-1 top-1 z-30 h-5 w-5 border-l border-t border-primary/70" />
                  <div className="pointer-events-none absolute right-1 top-1 z-30 h-5 w-5 border-r border-t border-primary/70" />
                  <div className="pointer-events-none absolute bottom-1 left-1 z-30 h-5 w-5 border-b border-l border-primary/70" />
                  <div className="pointer-events-none absolute bottom-1 right-1 z-30 h-5 w-5 border-b border-r border-primary/70" />

                  {/* CLOSE */}
                  <button
                    type="button"
                    onClick={() => onPick(null)}
                    aria-label="Close event details"
                    className="
                      absolute right-2 top-2 z-50
                      flex h-8 w-8
                      items-center justify-center
                      border border-primary/60
                      bg-black/90
                      text-xl text-primary
                      hover:bg-primary/10
                    "
                  >
                    ×
                  </button>

                  {/* =================================================
                      MOBILE POPUP
                     ================================================= */}
                  <div className="flex items-stretch md:hidden">
                    {/* MOBILE POSTER */}
                    <div className="flex w-[38%] shrink-0 items-center justify-center border-r border-primary/30 bg-[#090806] p-2.5">
                      {ev.poster ? (
                        <div className="w-full border border-primary/60 bg-black p-1">
                          <img
                            src={ev.poster}
                            alt={`${ev.name} poster`}
                            className="aspect-[3/4] w-full object-contain"
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[3/4] w-full items-center justify-center border border-primary/50 bg-black/50 p-2 text-center">
                          <div>
                            <p className="font-display text-[7px] tracking-[0.2em] text-primary">
                              SPARDHA 2K26
                            </p>

                            <p className="mt-2 font-display text-xs font-bold text-parchment">
                              {ev.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MOBILE IMPORTANT DETAILS */}
                    <div className="min-w-0 flex-1 px-3 pb-3 pt-4 pr-9">
                      {/* EVENT NAME */}
                      <p className="font-display text-[7px] font-bold tracking-[0.22em] text-primary">
                        {ev.day}
                      </p>

                      <h3 className="engraved mt-1 text-base font-bold leading-tight text-parchment">
                        {ev.name}
                      </h3>

                      <p className="mt-1 text-[8px] italic leading-tight text-parchment/60">
                        {ev.tag}
                      </p>

                      {/* IMPORTANT INFO */}
                      <div className="mt-3 space-y-1.5">
                        <div className="border border-primary/30 bg-primary/[0.07] px-2 py-1.5">
                          <p className="font-display text-[6px] font-bold tracking-[0.18em] text-primary">
                            DATE
                          </p>
                          <p className="mt-0.5 text-[9px] font-bold leading-tight text-parchment">
                            {ev.date}
                          </p>
                        </div>

                        <div className="border border-primary/30 bg-primary/[0.07] px-2 py-1.5">
                          <p className="font-display text-[6px] font-bold tracking-[0.18em] text-primary">
                            TIME
                          </p>
                          <p className="mt-0.5 text-[9px] font-bold leading-tight text-parchment">
                            {ev.time}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="border border-primary/40 bg-primary/[0.09] px-2 py-1.5">
                            <p className="font-display text-[6px] font-bold tracking-[0.18em] text-primary">
                              DAY
                            </p>
                            <p className="mt-0.5 text-[8px] font-bold uppercase leading-tight text-parchment">
                              {ev.day}
                            </p>
                          </div>

                          <div className="border border-primary/40 bg-primary/[0.09] px-2 py-1.5">
                            <p className="font-display text-[6px] font-bold tracking-[0.18em] text-primary">
                              TEAM
                            </p>
                            <p className="mt-0.5 text-[8px] font-bold uppercase leading-tight text-parchment">
                              {ev.teamSize === 1
                                ? "SOLO"
                                : `${ev.teamSize} MEMBERS`}
                            </p>
                          </div>
                        </div>

                        <div className="border border-primary/30 bg-primary/[0.07] px-2 py-1.5">
                          <p className="font-display text-[6px] font-bold tracking-[0.18em] text-primary">
                            FORMAT
                          </p>
                          <p className="mt-0.5 text-[8px] font-bold uppercase leading-tight text-parchment">
                            {ev.team}
                          </p>
                        </div>
                      </div>

                      {/* REGISTER */}
                      <button
                        type="button"
                        onClick={() => onRegister?.(ev.id)}
                        className="
                          shine
                          mt-3
                          min-h-10
                          w-full
                          border border-primary
                          bg-primary/20
                          px-2
                          py-2
                          font-display
                          text-[8px]
                          font-bold
                          tracking-[0.08em]
                          text-primary
                          shadow-[0_0_15px_rgba(212,175,55,0.15)]
                          transition
                          hover:bg-primary/30
                          active:scale-[0.97]
                        "
                      >
                        ⚔ REGISTER NOW
                      </button>
                    </div>
                  </div>

                  {/* =================================================
                      DESKTOP POPUP
                     ================================================= */}
                  <div className="hidden md:flex md:max-h-[94%] md:flex-row">
                    {/* DESKTOP POSTER */}
                    <div
                      className="
                        flex
                        w-[32%]
                        shrink-0
                        items-center
                        justify-center
                        border-r
                        border-primary/30
                        bg-[#090806]
                        px-5
                        py-7
                      "
                    >
                      {ev.poster ? (
                        <div className="relative w-full border border-primary/70 bg-black p-1 shadow-[0_0_30px_rgba(212,175,55,0.18)]">
                          <img
                            src={ev.poster}
                            alt={`${ev.name} poster`}
                            className="aspect-[3/4] w-full object-contain"
                            loading="eager"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[3/4] w-full items-center justify-center border border-primary/60 bg-black/60 p-4 text-center">
                          <div>
                            <p className="font-display text-[9px] tracking-[0.25em] text-primary">
                              SPARDHA 2K26
                            </p>

                            <h3 className="mt-3 font-display text-lg font-bold text-parchment">
                              {ev.name}
                            </h3>

                            <p className="mt-2 text-xs italic text-parchment/70">
                              {ev.tag}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* DESKTOP DETAILS */}
                    <div className="min-w-0 flex-1 overflow-y-auto p-7 pr-12">
                      <div className="border-b border-primary/20 pb-4">
                        <p className="font-display text-[9px] font-bold tracking-[0.3em] text-primary">
                          {ev.day} · SELECTED TERRITORY
                        </p>

                        <h3 className="engraved mt-1 text-3xl font-bold leading-tight text-parchment">
                          {ev.name}
                        </h3>

                        <p className="mt-1 text-xs italic text-parchment/60">
                          {ev.tag}
                        </p>
                      </div>

                      {/* INFO */}
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        <div className="border border-primary/30 bg-primary/[0.07] px-3 py-2.5">
                          <p className="font-display text-[8px] font-bold tracking-[0.2em] text-primary">
                            DATE
                          </p>
                          <p className="mt-1 text-sm font-bold text-parchment">
                            {ev.date}
                          </p>
                        </div>

                        <div className="border border-primary/30 bg-primary/[0.07] px-3 py-2.5">
                          <p className="font-display text-[8px] font-bold tracking-[0.2em] text-primary">
                            TIME
                          </p>
                          <p className="mt-1 text-sm font-bold text-parchment">
                            {ev.time}
                          </p>
                        </div>

                        <div className="border border-primary/50 bg-primary/[0.11] px-3 py-2.5">
                          <p className="font-display text-[8px] font-bold tracking-[0.2em] text-primary">
                            TEAM
                          </p>
                          <p className="mt-1 text-sm font-bold uppercase text-parchment">
                            {ev.teamSize === 1
                              ? "SOLO · 1"
                              : `${ev.teamSize} MEMBERS`}
                          </p>
                        </div>

                        <div className="border border-primary/30 bg-primary/[0.07] px-3 py-2.5">
                          <p className="font-display text-[8px] font-bold tracking-[0.2em] text-primary">
                            FORMAT
                          </p>
                          <p className="mt-1 text-sm font-bold uppercase text-parchment">
                            {ev.team}
                          </p>
                        </div>
                      </div>

                      {/* MISSION */}
                      <div className="mt-5">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="h-px w-5 bg-primary/60" />

                          <p className="font-display text-[8px] font-bold tracking-[0.25em] text-primary">
                            MISSION
                          </p>

                          <span className="h-px flex-1 bg-primary/20" />
                        </div>

                        <p className="text-sm leading-relaxed text-parchment/85">
                          {ev.about}
                        </p>
                      </div>

                      {/* EXTRA */}
                      {ev.extra && (
                        <div className="mt-3 border-l-2 border-primary/50 bg-primary/[0.05] px-3 py-2">
                          <p className="text-xs font-bold text-primary">
                            {ev.extra}
                          </p>
                        </div>
                      )}

                      {/* RULES */}
                      {ev.rules.length > 0 && (
                        <div className="mt-5">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="h-px w-5 bg-primary/60" />

                            <p className="font-display text-[8px] font-bold tracking-[0.25em] text-primary">
                              FIELD RULES
                            </p>

                            <span className="h-px flex-1 bg-primary/20" />
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {ev.rules.map((rule, index) => (
                              <p
                                key={rule}
                                className="text-[10px] leading-snug text-parchment/75"
                              >
                                <span className="mr-1 text-primary">
                                  {String(index + 1).padStart(2, "0")}
                                </span>

                                {rule}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {ev.closing && (
                        <p className="mt-3 text-[9px] font-bold tracking-[0.1em] text-primary">
                          {ev.closing}
                        </p>
                      )}

                      {/* DESKTOP BUTTONS */}
                      <div className="mt-5 flex gap-2 border-t border-primary/20 pt-4">
                        <button
                          type="button"
                          onClick={() => onRegister?.(ev.id)}
                          className="
                            shine
                            min-h-10
                            flex-1
                            border border-primary
                            bg-primary/20
                            px-3
                            py-2.5
                            font-display
                            text-xs
                            font-bold
                            tracking-[0.1em]
                            text-primary
                            transition
                            hover:bg-primary/30
                            active:scale-[0.98]
                          "
                        >
                          ⚔ REGISTER NOW
                        </button>

                        <button
                          type="button"
                          onClick={() => onPick(null)}
                          className="
                            min-h-10
                            border border-parchment/30
                            bg-black/30
                            px-4
                            py-2.5
                            font-display
                            text-xs
                            tracking-[0.1em]
                            text-parchment
                            transition
                            hover:border-primary/50
                            hover:text-primary
                            active:scale-[0.98]
                          "
                        >
                          ← BACK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DAY SELECTORS */}
        <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDay(1);
              onPick(null);
            }}
            className={`min-h-16 border px-5 py-4 text-left transition-all duration-200 active:scale-[0.98] ${selectedDay === 1
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

              <span className="text-lg text-primary">→</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDay(2);
              onPick(null);
            }}
            className={`min-h-16 border px-5 py-4 text-left transition-all duration-200 active:scale-[0.98] ${selectedDay === 2
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

              <span className="text-lg text-primary">→</span>
            </div>
          </button>
        </div>

        {/* EVENT CARDS */}
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {selectedEvents.map((event) => (
              <article
                key={event.id}
                className="woodboard flex h-full flex-col overflow-hidden border border-primary/40 shadow-2xl"
              >
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

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="text-sm font-semibold leading-relaxed text-parchment/90 md:text-base">
                    {event.about}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="border border-primary/30 bg-primary/10 px-3 py-3">
                      <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary">
                        DATE
                      </p>

                      <p className="mt-1 text-sm font-bold text-parchment">
                        {event.date}
                      </p>
                    </div>

                    <div className="border border-primary/30 bg-primary/10 px-3 py-3">
                      <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary">
                        TIME
                      </p>

                      <p className="mt-1 text-sm font-bold text-parchment">
                        {event.time}
                      </p>
                    </div>

                    <div className="border border-primary/50 bg-primary/15 px-3 py-3">
                      <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary">
                        TEAM SIZE
                      </p>

                      <p className="mt-1 text-sm font-bold uppercase text-parchment">
                        {event.teamSize === 1
                          ? "SOLO · 1 MEMBER"
                          : `${event.teamSize} MEMBERS`}
                      </p>
                    </div>

                    <div className="border border-primary/30 bg-primary/10 px-3 py-3">
                      <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary">
                        FORMAT
                      </p>

                      <p className="mt-1 text-sm font-bold uppercase text-parchment">
                        {event.team}
                      </p>
                    </div>

                    {event.extra && (
                      <div className="col-span-2 border border-primary/25 bg-primary/5 px-3 py-3">
                        <p className="font-display text-[9px] font-bold tracking-[0.2em] text-primary">
                          DETAIL
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-relaxed text-parchment/90">
                          {event.extra}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <p className="font-display text-[10px] font-semibold tracking-[0.25em] text-primary">
                      RULES
                    </p>

                    <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-parchment/90">
                      {event.rules.map((rule) => (
                        <li key={rule}>✦ {rule}</li>
                      ))}
                    </ul>
                  </div>

                  {event.closing && (
                    <p className="mt-4 font-display text-xs font-semibold tracking-[0.15em] text-primary">
                      {event.closing}
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => onRegister?.(event.id)}
                      className="shine min-h-12 w-full border border-primary/60 bg-primary/20 px-5 py-3 font-display text-xs font-bold tracking-[0.15em] text-primary transition hover:bg-primary/30 active:scale-[0.98] md:text-sm"
                    >
                      ⚔ REGISTER FOR MISSION
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}