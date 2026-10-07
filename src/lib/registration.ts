<<<<<<< HEAD
import { supabase } from "@/lib/supabase";

export type Participant = {
  name: string;
  college: string;
  rollNo: string;
  mobile: string;
  email: string;
};

export type Participant2 = {
  name: string;
  email: string;
};

export type RegData = {
  event: string;
  day: string;
  date: string;
  teamSize: number;
  participant1: Participant;

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
   *
   *   "the-last-signal": {
   *     name: "Priya",
   *     email: "priya@gmail.com"
   *   }
   * }
   */
  participant2ByEvent: Record<string, Participant2>;
};

export type RegResult =
  | {
      status: "sent";
      id: string;
    }
  | {
      status: "error";
      message: string;
      fields?: Record<string, string>;
    };

export async function submitRegistration(
  data: RegData,
): Promise<RegResult> {
  try {
    /*
     * ---------------------------------------------------------
     * SAVE ONE REGISTRATION ROW TO SUPABASE
     * ---------------------------------------------------------
     *
     * IMPORTANT:
     *
     * One call to insert()
     *       ↓
     * One database row
     *       ↓
     * One registration ID
     *
     * Even if 4 events are selected.
     */

    const { data: inserted, error } = await supabase
      .from("registrations")
      .insert({
        event: data.event,
        day: data.day,
        team_size: data.teamSize,

        participant1_name: data.participant1.name,
        participant1_college: data.participant1.college,
        participant1_roll_no: data.participant1.rollNo,
        participant1_mobile: data.participant1.mobile,
        participant1_email: data.participant1.email,

        /*
         * These old columns are kept for compatibility.
         *
         * The actual Participant 2 information is now stored
         * in participant2_by_event.
         */
        participant2_name: null,
        participant2_email: null,

        /*
         * All team-event Participant 2 details
         * are stored inside ONE JSONB column.
         */
        participant2_by_event:
          data.participant2ByEvent,
      })
      .select("registration_id")
      .single();

    if (error) {
      console.error(
        "Supabase registration error:",
        error,
      );

      return {
        status: "error",
        message:
          error.message ||
          "Registration failed. Please try again.",
      };
    }

    /*
     * ---------------------------------------------------------
     * SEND CONFIRMATION EMAIL
     * ---------------------------------------------------------
     */

    const { error: emailError } =
      await supabase.functions.invoke(
        "send-registration-email",
        {
          body: {
            registrationId:
              inserted.registration_id,

            event: data.event,
            day: data.day,
            date: data.date,

            participant1:
              data.participant1,

            participant2ByEvent:
              data.participant2ByEvent,
          },
        },
      );

    if (emailError) {
      console.error(
        "Email sending error:",
        emailError,
      );
    }

    /*
     * ---------------------------------------------------------
     * REGISTRATION SUCCESSFUL
     * ---------------------------------------------------------
     */

    return {
      status: "sent",
      id: inserted.registration_id,
    };
  } catch (error) {
    console.error(
      "Registration error:",
      error,
    );

    return {
      status: "error",
      message:
        "Something went wrong. Please try again.",
    };
  }
}
=======
// Backend: Google Apps Script web app (see backend/Code.gs + BACKEND_SETUP.md).
// Put the deployed URL in .env as VITE_REGISTRATION_ENDPOINT. If empty, falls back to the mail app.
export const REGISTRATION_ENDPOINT: string = (import.meta.env.VITE_REGISTRATION_ENDPOINT as string | undefined) ?? "";
export const REGISTRATION_EMAIL = "acm.vvit@gmail.com";

export type RegData = { name: string; email: string; phone: string; college: string; event: string; day: string; teamSize: number; website?: string };
export type RegResult =
  | { status: "sent"; id: string }
  | { status: "mail" }
  | { status: "error"; message: string; fields?: Record<string, string> };

export async function submitRegistration(d: RegData): Promise<RegResult> {
  if (REGISTRATION_ENDPOINT) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 20000);
    try {
      // text/plain avoids a CORS preflight, which Apps Script does not answer.
      const res = await fetch(REGISTRATION_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(d), signal: ctl.signal });
      const j = await res.json();
      if (j.ok) return { status: "sent", id: j.id };
      return { status: "error", message: j.error || "Registration failed", fields: j.errors };
    } catch {
      return { status: "error", message: "Network problem — please check your connection and retry, or email " + REGISTRATION_EMAIL };
    } finally { clearTimeout(timer); }
  }
  const body = `Spardha 2K26 registration\n\nEvent: ${d.event} (${d.day})\nTeam leader: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nCollege: ${d.college}\nTeam size: ${d.teamSize}`;
  window.location.href = `mailto:${REGISTRATION_EMAIL}?subject=${encodeURIComponent(`Registration — ${d.event}`)}&body=${encodeURIComponent(body)}`;
  return { status: "mail" };
}
>>>>>>> 87f7d195d037968f5198ad98853b6babb8c139b6
