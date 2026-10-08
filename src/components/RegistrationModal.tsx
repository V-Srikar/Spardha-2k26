import { useEffect, useRef, useState } from "react";
import { submitRegistration } from "@/lib/registration";

type RegEvent = {
  id: string;
  name: string;
  day: string;
  date: string;
  teamSize: number;
};

type Participant1 = {
  name: string;
  college: string;
  rollNo: string;
  mobile: string;
  email: string;
};

type Participant2 = {
  name: string;
  email: string;
};

type RegistrationDraft = {
  selectedDays: string[];
  selectedEvents: string[];
  p1: Participant1;
  p2ByEvent: Record<string, Participant2>;
};

type RegistrationModalProps = {
  open: boolean;
  eventId?: string | null;
  events: RegEvent[];
  onClose: () => void;
};

const emptyParticipant1: Participant1 = {
  name: "",
  college: "",
  rollNo: "",
  mobile: "",
  email: "",
};

const emptyParticipant2: Participant2 = {
  name: "",
  email: "",
};

const DRAFT_KEY = "spardha-registration-draft-home";

const emailRegex = /^[A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

const getDraft = (): RegistrationDraft | null => {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);

    if (!saved) return null;

    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const saveDraft = (draft: RegistrationDraft) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Ignore localStorage errors
  }
};

const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore localStorage errors
  }
};

export function RegistrationModal({
  open,
  eventId: _eventId,
  events,
  onClose,
}: RegistrationModalProps) {
  /*
   * eventId is intentionally ignored.
   *
   * Every Register button opens the SAME registration form.
   */

  const [selectedDays, setSelectedDays] = useState<string[]>(["Day 1"]);

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const [p1, setP1] = useState<Participant1>(emptyParticipant1);

  /*
   * Each team event has its own Participant 2.
   *
   * Example:
   *
   * {
   *   "prompt-the-unknown": {
   *     name: "Rahul",
   *     email: "rahul@gmail.com"
   *   },
   *   "the-last-signal": {
   *     name: "Priya",
   *     email: "priya@gmail.com"
   *   }
   * }
   */

  const [p2ByEvent, setP2ByEvent] = useState<Record<string, Participant2>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [busy, setBusy] = useState(false);

  const [done, setDone] = useState<string | null>(null);

  const [loaded, setLoaded] = useState(false);

  const first = useRef<HTMLInputElement>(null);

  /*
   * =========================================================
   * OPEN MODAL
   * =========================================================
   */

  useEffect(() => {
    if (!open) {
      setLoaded(false);
      return;
    }

    const draft = getDraft();

    if (draft) {
      setSelectedDays(draft.selectedDays?.length ? draft.selectedDays : ["Day 1"]);

      setSelectedEvents(draft.selectedEvents || []);

      setP1(draft.p1 || emptyParticipant1);

      setP2ByEvent(draft.p2ByEvent || {});
    } else {
      /*
       * INITIAL STATE
       *
       * Day 1 is checked.
       *
       * Events are NOT automatically selected.
       */

      setSelectedDays(["Day 1"]);

      setSelectedEvents([]);

      setP1(emptyParticipant1);

      setP2ByEvent({});
    }

    setErrors({});
    setDone(null);
    setBusy(false);
    setLoaded(true);

    setTimeout(() => {
      first.current?.focus();
    }, 100);
  }, [open, events]);

  /*
   * =========================================================
   * SAVE DRAFT
   * =========================================================
   */

  useEffect(() => {
    if (!open || !loaded || done) return;

    saveDraft({
      selectedDays,
      selectedEvents,
      p1,
      p2ByEvent,
    });
  }, [open, loaded, done, selectedDays, selectedEvents, p1, p2ByEvent]);

  /*
   * =========================================================
   * DAY TOGGLE
   *
   * IMPORTANT:
   *
   * Checking Day 2 does NOT automatically select
   * Day 2 events.
   *
   * Unchecking a day does NOT remove event selections.
   *
   * Days control ONLY which events are visible.
   * =========================================================
   */

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );

    setErrors({});
  };

  /*
   * =========================================================
   * EVENT TOGGLE
   * =========================================================
   */

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) => {
      const wasSelected = prev.includes(eventId);

      if (wasSelected) {
        /*
         * Remove Participant 2 information
         * when this event is unchecked.
         */

        setP2ByEvent((p2Prev) => {
          const next = { ...p2Prev };

          delete next[eventId];

          return next;
        });

        return prev.filter((id) => id !== eventId);
      }

      return [...prev, eventId];
    });

    setErrors({});
  };

  /*
   * =========================================================
   * VISIBLE EVENTS
   *
   * Day 1 checked:
   * → Day 1 events appear
   *
   * Day 1 + Day 2 checked:
   * → Both days' events appear
   *
   * Only Day 2 checked:
   * → Only Day 2 events appear
   *
   * No day checked:
   * → No events appear
   * =========================================================
   */

  const visibleEvents = events.filter((event) =>
    selectedDays.some((day) => event.day.startsWith(day)),
  );

  /*
   * =========================================================
   * SELECTED EVENTS
   * =========================================================
   */

  const selectedEventObjects = events.filter((event) => selectedEvents.includes(event.id));

  /*
   * =========================================================
   * TEAM EVENTS
   * =========================================================
   */

  const teamEvents = selectedEventObjects.filter((event) => event.teamSize === 2);

  const isTeam = teamEvents.length > 0;

  /*
   * =========================================================
   * PARTICIPANT 1 UPDATE
   * =========================================================
   */

  const updateP1 = (field: keyof Participant1, value: string) => {
    setP1((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const next = { ...prev };

      delete next[field];

      return next;
    });
  };

  /*
   * =========================================================
   * PARTICIPANT 2 UPDATE
   * =========================================================
   */

  const updateP2 = (eventId: string, field: keyof Participant2, value: string) => {
    setP2ByEvent((prev) => ({
      ...prev,

      [eventId]: {
        ...(prev[eventId] || emptyParticipant2),

        [field]: value,
      },
    }));

    setErrors((prev) => {
      const next = { ...prev };

      delete next[`p2_${eventId}_${field}`];

      return next;
    });
  };

  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (selectedDays.length === 0) {
      nextErrors.days = "Please select at least one day.";
    }

    if (selectedEvents.length === 0) {
      nextErrors.events = "Please select at least one event.";
    }

    /*
     * PARTICIPANT 1
     */

    if (!p1.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (!/^[A-Za-z ]+$/.test(p1.name.trim())) {
      nextErrors.name = "Name can contain only letters and spaces.";
    }

    if (!p1.college.trim()) {
      nextErrors.college = "College name is required.";
    } else if (!/^[A-Za-z0-9 .,&'()/-]+$/.test(p1.college.trim())) {
      nextErrors.college = "College name contains invalid characters.";
    }

    if (!p1.rollNo.trim()) {
      nextErrors.rollNo = "Roll number is required.";
    } else if (!/^[A-Za-z0-9/-]+$/.test(p1.rollNo.trim())) {
      nextErrors.rollNo = "Roll number contains invalid characters.";
    }

    if (!p1.mobile.trim()) {
      nextErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(p1.mobile.trim())) {
      nextErrors.mobile = "Mobile number must contain exactly 10 digits.";
    }

    if (!p1.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(p1.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    /*
     * PARTICIPANT 2
     *
     * Every selected team event gets its
     * own Participant 2.
     */

    teamEvents.forEach((event) => {
      const participant2 = p2ByEvent[event.id] || emptyParticipant2;

      if (!participant2.name.trim()) {
        nextErrors[`p2_${event.id}_name`] = `Participant 2 name is required for ${event.name}.`;
      } else if (!/^[A-Za-z ]+$/.test(participant2.name.trim())) {
        nextErrors[`p2_${event.id}_name`] = "Name can contain only letters and spaces.";
      }

      if (!participant2.email.trim()) {
        nextErrors[`p2_${event.id}_email`] = `Participant 2 email is required for ${event.name}.`;
      } else if (!emailRegex.test(participant2.email.trim())) {
        nextErrors[`p2_${event.id}_email`] = "Please enter a valid email address.";
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /*
   * =========================================================
   * SUBMIT
   *
   * ONE call = ONE registration ID
   * =========================================================
   */

  const handleSubmit = async () => {
    if (busy) return;

    if (!validate()) return;

    setBusy(true);

    try {
      const registrationEvents = selectedEventObjects;

      const eventNames = registrationEvents.map((event) => event.name).join(", ");

      const days = [...new Set(registrationEvents.map((event) => event.day))].join(", ");

      const dates = [...new Set(registrationEvents.map((event) => event.date))].join(", ");

      /*
       * Build Participant 2 object.
       *
       * Each team event has a separate entry.
       */

      const participant2ByEvent: Record<string, Participant2> = {};

      teamEvents.forEach((event) => {
        const participant2 = p2ByEvent[event.id];

        if (participant2) {
          participant2ByEvent[event.id] = {
            name: participant2.name.trim(),
            email: participant2.email.trim(),
          };
        }
      });

      /*
       * IMPORTANT:
       *
       * This is ONE database insert.
       *
       * Therefore even if the user selects:
       *
       * Code Dunes
       * Prompt the Unknown
       * The Cursed Seas
       * The Last Signal
       *
       * only ONE registration ID is generated.
       */

      const result = await submitRegistration({
        event: eventNames,
        day: days,
        date: dates,

        teamSize: isTeam ? 2 : 1,

        participant1: {
          name: p1.name.trim(),
          college: p1.college.trim(),
          rollNo: p1.rollNo.trim(),
          mobile: p1.mobile.trim(),
          email: p1.email.trim(),
        },

        participant2ByEvent,
      });

      if (result.status === "sent") {
        clearDraft();

        setDone(result.id);
      } else {
        setErrors({
          submit: result.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      setErrors({
        submit: "Something went wrong. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  /*
   * =========================================================
   * CLOSE
   * =========================================================
   */

  const handleClose = () => {
    if (busy) return;

    onClose();
  };

  /*
   * =========================================================
   * CLOSED
   * =========================================================
   */

  if (!open) return null;

  /*
   * =========================================================
   * SUCCESS SCREEN
   * =========================================================
   */

  if (done) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-[#17120d] p-8 text-center text-white shadow-2xl">
          <div className="mb-5 text-5xl">✓</div>

          <h2 className="mb-3 text-2xl font-bold">Registration Successful</h2>

          <p className="mb-2 text-white/70">Your registration has been submitted successfully.</p>

          <p className="mb-6 text-lg font-semibold text-amber-400">Registration ID: {done}</p>

          <p className="mb-6 text-sm text-white/60">
            A confirmation email will be sent to your registered email address.
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-500"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * MAIN MODAL
   * =========================================================
   */

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl border border-amber-500/30 bg-[#17120d] text-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">SPARDHA 2K26</h2>

            <p className="mt-1 text-sm text-white/50">Registration — The Uncharted</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={busy}
            className="text-2xl text-white/50 transition hover:text-white disabled:opacity-30"
          >
            ×
          </button>
        </div>

        {/* BODY */}

        <div className="space-y-8 p-6">
          {/* =================================================
              DAY SELECTION
              ================================================= */}

          <section>
            <h3 className="mb-4 text-lg font-semibold">Select Day</h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {["Day 1", "Day 2"].map((day) => {
                const checked = selectedDays.includes(day);

                return (
                  <label
                    key={day}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      checked
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDay(day)}
                      className="h-5 w-5 accent-amber-500"
                    />

                    <span className="font-medium">{day}</span>
                  </label>
                );
              })}
            </div>

            {errors.days && <p className="mt-2 text-sm text-red-400">{errors.days}</p>}
          </section>

          {/* =================================================
              EVENT SELECTION
              ================================================= */}

          <section>
            <h3 className="mb-4 text-lg font-semibold">Select Events</h3>

            {visibleEvents.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center text-sm text-white/50">
                Please select a day to view its events.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleEvents.map((event) => {
                  const checked = selectedEvents.includes(event.id);

                  return (
                    <label
                      key={event.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        checked
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEvent(event.id)}
                        className="mt-1 h-5 w-5 accent-amber-500"
                      />

                      <div>
                        <div className="font-semibold">{event.name}</div>

                        <div className="mt-1 text-xs text-white/50">
                          {event.day} • {event.teamSize === 2 ? "Team of 2" : "Solo"}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {errors.events && <p className="mt-2 text-sm text-red-400">{errors.events}</p>}
          </section>

          {/* =================================================
              PARTICIPANT 1
              ================================================= */}

          <section>
            <h3 className="mb-4 text-lg font-semibold">Participant 1</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* NAME */}

              <div>
                <label className="mb-1 block text-sm text-white/70">Name *</label>

                <input
                  ref={first}
                  type="text"
                  value={p1.name}
                  onChange={(e) => updateP1("name", e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-500"
                />

                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              {/* COLLEGE */}

              <div>
                <label className="mb-1 block text-sm text-white/70">College Name *</label>

                <input
                  type="text"
                  value={p1.college}
                  onChange={(e) => updateP1("college", e.target.value)}
                  placeholder="Enter college name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-500"
                />

                {errors.college && <p className="mt-1 text-xs text-red-400">{errors.college}</p>}
              </div>

              {/* ROLL NUMBER */}

              <div>
                <label className="mb-1 block text-sm text-white/70">Roll Number *</label>

                <input
                  type="text"
                  value={p1.rollNo}
                  onChange={(e) => updateP1("rollNo", e.target.value)}
                  placeholder="Enter roll number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-500"
                />

                {errors.rollNo && <p className="mt-1 text-xs text-red-400">{errors.rollNo}</p>}
              </div>

              {/* MOBILE */}

              <div>
                <label className="mb-1 block text-sm text-white/70">Mobile Number *</label>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={p1.mobile}
                  onChange={(e) => updateP1("mobile", e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-500"
                />

                {errors.mobile && <p className="mt-1 text-xs text-red-400">{errors.mobile}</p>}
              </div>

              {/* EMAIL */}

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-white/70">Email *</label>

                <input
                  type="email"
                  value={p1.email}
                  onChange={(e) => updateP1("email", e.target.value.replace(/\s/g, ""))}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-500"
                />

                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>
          </section>

          {/* =================================================
              PARTICIPANT 2
              ================================================= */}

          {isTeam && (
            <section>
              <h3 className="mb-2 text-lg font-semibold">Team Participants</h3>

              <p className="mb-4 text-sm text-white/50">
                Each selected team event requires its own Participant 2.
              </p>

              <div className="space-y-5">
                {teamEvents.map((event) => {
                  const participant2 = p2ByEvent[event.id] || emptyParticipant2;

                  return (
                    <div
                      key={event.id}
                      className="rounded-xl border border-amber-500/20 bg-white/[0.03] p-5"
                    >
                      <div className="mb-4">
                        <div className="font-semibold text-amber-400">{event.name}</div>

                        <div className="mt-1 text-xs text-white/40">Participant 2</div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* NAME */}

                        <div>
                          <label className="mb-1 block text-sm text-white/70">Name *</label>

                          <input
                            type="text"
                            value={participant2.name}
                            onChange={(e) => updateP2(event.id, "name", e.target.value)}
                            placeholder="Enter participant 2 name"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-500"
                          />

                          {errors[`p2_${event.id}_name`] && (
                            <p className="mt-1 text-xs text-red-400">
                              {errors[`p2_${event.id}_name`]}
                            </p>
                          )}
                        </div>

                        {/* EMAIL */}

                        <div>
                          <label className="mb-1 block text-sm text-white/70">Email *</label>

                          <input
                            type="email"
                            value={participant2.email}
                            onChange={(e) =>
                              updateP2(event.id, "email", e.target.value.replace(/\s/g, ""))
                            }
                            placeholder="Enter participant 2 email"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-amber-500"
                          />

                          {errors[`p2_${event.id}_email`] && (
                            <p className="mt-1 text-xs text-red-400">
                              {errors[`p2_${event.id}_email`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* =================================================
              SUBMIT ERROR
              ================================================= */}

          {errors.submit && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {errors.submit}
            </div>
          )}

          {/* =================================================
              SELECTED EVENTS SUMMARY
              ================================================= */}

          {selectedEventObjects.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="mb-3 font-semibold">Selected Events</h3>

              <div className="space-y-2">
                {selectedEventObjects.map((event) => (
                  <div key={event.id} className="flex items-center justify-between text-sm">
                    <span>{event.name}</span>

                    <span className="text-xs text-white/40">{event.day}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =================================================
              SUBMIT BUTTON
              ================================================= */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            className="w-full rounded-xl bg-amber-600 px-6 py-4 font-bold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Submitting Registration..." : "Submit Registration"}
          </button>
        </div>
      </div>
    </div>
  );
}
