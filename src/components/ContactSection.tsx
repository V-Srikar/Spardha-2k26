import { useEffect, useState } from "react";

const PHONES = ["+91 63007 01013", "+91 97057 57657", "+91 63019 10041"];

const EMAIL = "acm.vvit@gmail.com";

const INSTA = "acm_vvitu";

const ADDRESS =
  "Vasireddy Venkatadri International Technological University, Nambur (V), Guntur, Andhra Pradesh 522508";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Vasireddy Venkatadri International Technological University, Nambur, Guntur");

const FEST_START = new Date("2026-10-12T09:00:00+05:30").getTime();

const TIMELINE = [
  {
    label: "Festival Dates",
    text: "October 12–13, 2026",
    end: new Date("2026-10-13T23:59:59+05:30").getTime(),
  },
];

const I = {
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),

  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),

  insta: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" />
    </>
  ),

  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),

  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),

  check: <path d="m5 12 5 5 9-10" />,
};

function Icon({ d, className = "" }: { d: keyof typeof I; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 ${className}`}
      aria-hidden
    >
      {I[d]}
    </svg>
  );
}

function Countdown({ now }: { now: number | null }) {
  if (now === null) {
    return <div className="ct-count" aria-hidden />;
  }

  const diff = Math.max(0, FEST_START - now);

  const parts = [
    ["DAYS", Math.floor(diff / 864e5)],
    ["HRS", Math.floor(diff / 36e5) % 24],
    ["MIN", Math.floor(diff / 6e4) % 60],
    ["SEC", Math.floor(diff / 1e3) % 60],
  ] as const;

  return (
    <div className="ct-count" role="timer" aria-label="Time until Spardha 2K26">
      {parts.map(([label, value]) => (
        <div key={label}>
          <b>{String(value).padStart(2, "0")}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function ContactSection() {
  const [now, setNow] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setNow(Date.now());

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(key);

      setTimeout(() => {
        setCopied((current) => (current === key ? null : current));
      }, 1600);
    } catch {
      /* Clipboard unavailable */
    }
  };

  const row = (id: string, icon: keyof typeof I, label: string, value: string, href: string) => (
    <div className="ct-row" key={id}>
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="ct-row-main"
      >
        <span className="ct-ico">
          <Icon d={icon} />
        </span>

        <span>
          <small>{label}</small>
          <strong>{value}</strong>
        </span>
      </a>

      <button
        type="button"
        className="ct-copy"
        aria-label={`Copy ${value}`}
        onClick={() => copy(id, value)}
      >
        <Icon d={copied === id ? "check" : "copy"} className="h-4 w-4" />
        <span>{copied === id ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );

  const next = TIMELINE.findIndex((item) => now !== null && item.end >= now);

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-28">
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* HEADER */}
        <div className="scrim mx-auto max-w-3xl px-6 py-8 text-center">
          <p className="chapter font-display text-xs font-semibold tracking-[0.5em] text-primary">
            CHAMBER IV
          </p>

          <h2 className="engraved mt-3 text-5xl font-bold md:text-6xl">CONTACT US</h2>

          <p className="mt-3 font-serif text-xl font-semibold text-parchment">
            Connect with us for queries, partnerships, or to join the Tech revolution.
          </p>
        </div>

        {/* CONTACT CONTENT */}
        <div className="mt-10 space-y-6">
          {/* REACH US */}
          <div className="ct-card">
            <h3 className="ct-h">REACH US</h3>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {PHONES.map((phone, index) =>
                row(`p${index}`, "phone", "Call", phone, `tel:${phone.replace(/\s/g, "")}`),
              )}

              {row("ig", "insta", "Instagram", `@${INSTA}`, `https://instagram.com/${INSTA}`)}

              {row("em", "mail", "Email", EMAIL, `mailto:${EMAIL}`)}
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* IMPORTANT DATES */}
            <div className="ct-card lg:col-span-3">
              <h3 className="ct-h">IMPORTANT DATES</h3>

              <Countdown now={now} />

              <ol className="ct-tl mt-5">
                {TIMELINE.map((item, index) => {
                  const done = now !== null && item.end < now;

                  return (
                    <li key={item.label} className={done ? "done" : index === next ? "next" : ""}>
                      <i>{done && <Icon d="check" className="h-3 w-3" />}</i>

                      <div>
                        <small>{item.label}</small>
                        <strong>{item.text}</strong>
                      </div>

                      <em>{done ? "Completed" : index === next ? "Upcoming" : ""}</em>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* VENUE */}
            <div className="ct-card lg:col-span-2">
              <h3 className="ct-h">VENUE</h3>

              <div className="mt-5 flex gap-4">
                <span className="ct-ico shrink-0">
                  <Icon d="pin" />
                </span>

                <div>
                  <p className="font-semibold text-parchment">VVIT University, Guntur</p>

                  <p className="mt-2 text-sm font-medium leading-relaxed text-parchment/85">
                    {ADDRESS}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={MAP_URL} target="_blank" rel="noreferrer" className="ct-send ct-inline">
                  GET DIRECTIONS
                </a>

                <button type="button" className="ct-ghost" onClick={() => copy("addr", ADDRESS)}>
                  {copied === "addr" ? "ADDRESS COPIED" : "COPY ADDRESS"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
