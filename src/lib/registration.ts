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

export async function submitRegistration(data: RegData): Promise<RegResult> {
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
        participant2_by_event: data.participant2ByEvent,
      })
      .select("registration_id")
      .single();

    if (error) {
      console.error("Supabase registration error:", error);

      return {
        status: "error",
        message: error.message || "Registration failed. Please try again.",
      };
    }

    /*
     * ---------------------------------------------------------
     * SEND CONFIRMATION EMAIL
     * ---------------------------------------------------------
     */

    const { error: emailError } = await supabase.functions.invoke("send-registration-email", {
      body: {
        registrationId: inserted.registration_id,

        event: data.event,
        day: data.day,
        date: data.date,

        participant1: data.participant1,

        participant2ByEvent: data.participant2ByEvent,
      },
    });

    if (emailError) {
      console.error("Email sending error:", emailError);
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
    console.error("Registration error:", error);

    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}
