import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BANNER_URL =
  "https://zkwqtpgosebzcmpqifze.supabase.co/storage/v1/object/public/spardha-assets/spardha-email-banner.jpg";

const INSTAGRAM_ICON_URL = "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const {
      registrationId,
      event,
      day,
      date,
      participant1,
      participant2ByEvent = {},
      participant2,
      teamParticipants = [],
    } = await req.json();

    if (!registrationId || !event || !day || !participant1?.email) {
      return new Response(
        JSON.stringify({
          error: "Missing required registration details",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpUser || !smtpPassword) {
      throw new Error("SMTP credentials are not configured");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    /* -----------------------------------------
       PARTICIPANT 2 DETAILS
    ----------------------------------------- */

    let participant2Html = "";

    if (
      participant2ByEvent &&
      typeof participant2ByEvent === "object" &&
      !Array.isArray(participant2ByEvent)
    ) {
      participant2Html = Object.entries(participant2ByEvent)
        .map(([eventId, participant]) => {
          const p = participant as {
            name?: string;
            email?: string;
          };

          if (!p?.name || !p?.email) {
            return "";
          }

          return `
            <div style="margin-top:12px;">
              <strong>Participant 2 for ${eventId} :</strong>
              ${p.name}
            </div>

            <div>
              <strong>Participant 2 Email :</strong>
              <a href="mailto:${p.email}">
                ${p.email}
              </a>
            </div>
          `;
        })
        .join("");
    }

    /* -----------------------------------------
       OLD FORMAT SUPPORT
    ----------------------------------------- */

    if (!participant2Html && Array.isArray(teamParticipants) && teamParticipants.length > 0) {
      participant2Html = teamParticipants
        .map(
          (participant: { eventName?: string; name?: string; email?: string }) => `
            <div style="margin-top:12px;">
              <strong>Participant 2 for ${participant.eventName ?? ""} :</strong>
              ${participant.name ?? ""}
            </div>

            <div>
              <strong>Participant 2 Email :</strong>
              <a href="mailto:${participant.email ?? ""}">
                ${participant.email ?? ""}
              </a>
            </div>
          `,
        )
        .join("");
    }

    /* -----------------------------------------
       VERY OLD FORMAT SUPPORT
    ----------------------------------------- */

    if (!participant2Html && participant2) {
      participant2Html = `
        <div style="margin-top:12px;">
          <strong>Participant 2 Name :</strong>
          ${participant2.name}
        </div>

        <div>
          <strong>Participant 2 Email :</strong>
          <a href="mailto:${participant2.email}">
            ${participant2.email}
          </a>
        </div>
      `;
    }

    /* -----------------------------------------
       EMAIL HTML
    ----------------------------------------- */

    const html = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>SPARDHA 2K26 Registration</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#ffffff;
    font-family:Arial,Helvetica,sans-serif;
    color:#111111;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#ffffff;"
  >

    <tr>

      <td align="center">

        <table
          width="700"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:700px;
            max-width:700px;
            background:#ffffff;
          "
        >

          <!-- =====================================
               BANNER
          ====================================== -->

          <tr>

            <td style="padding:20px 0 15px 0;">

              <img
                src="${BANNER_URL}"
                alt="SPARDHA 2K26"
                width="700"
                style="
                  display:block;
                  width:700px;
                  max-width:100%;
                  height:auto;
                  border:0;
                "
              />

            </td>

          </tr>


          <!-- =====================================
               MESSAGE
          ====================================== -->

          <tr>

            <td
              style="
                padding:0;
                font-size:13px;
                line-height:1.6;
              "
            >

              <p style="margin:0 0 22px 0;">
                Hello,
              </p>


              <p style="margin:0 0 18px 0;">

                Thank you for registering for
                <strong>SPARDHA 2K26</strong>,
                our highly anticipated annual event!

                We are thrilled to have you join us
                for this exciting gathering of
                like-minded individuals and enthusiasts.

              </p>


              <p style="margin:0 0 18px 0;">

                This email is to confirm that we have
                received your registration for the event.

                Your participation is greatly appreciated,
                and we can't wait to provide you with an
                unforgettable experience.

              </p>


              <p style="margin:0 0 40px 0;">

                <strong>
                  **ID Cards are mandatory for participating in the event.**
                </strong>

              </p>


              <p style="margin:0 0 25px 0;">
                Thanks.
              </p>

            </td>

          </tr>


          <!-- =====================================
               INSTAGRAM STRIP
          ====================================== -->

          <tr>

            <td style="padding:0 0 55px 0;">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#000000;
                "
              >

                <tr>

                  <!-- INSTAGRAM ICON -->

                  <td
                    width="95"
                    style="
                      width:95px;
                      padding:0;
                      vertical-align:middle;
                    "
                  >

                    <a
                      href="https://www.instagram.com/acm_vvitu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="
                        display:block;
                        text-decoration:none;
                      "
                    >

                      <img
                        src="${INSTAGRAM_ICON_URL}"
                        alt="Instagram"
                        width="65"
                        height="65"
                        style="
                          display:block;
                          width:65px;
                          height:65px;
                          margin:0 auto;
                          border:0;
                        "
                      />

                    </a>

                  </td>


                  <!-- INSTAGRAM TEXT -->

                  <td
                    style="
                      vertical-align:middle;
                      padding-left:5px;
                    "
                  >

                    <a
                      href="https://www.instagram.com/acm_vvitu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="
                        color:#ffffff;
                        font-size:12px;
                        font-weight:bold;
                        text-decoration:underline;
                      "
                    >

                      Follow us on Instagram

                    </a>

                  </td>

                </tr>

              </table>

            </td>

          </tr>


          <!-- =====================================
               REGISTRATION DETAILS
          ====================================== -->

          <tr>

            <td
              style="
                padding:0;
                font-size:12px;
                line-height:1.55;
              "
            >

              <div>
                <strong>Form :</strong>
                SPARDHA 2K26 Registration
              </div>


              <div>
                <strong>Name :</strong>
                ${participant1.name}
              </div>


              <div>
                <strong>College Name :</strong>
                ${participant1.college}
              </div>


              <div>
                <strong>Roll no :</strong>
                ${participant1.rollNo}
              </div>


              <div>
                <strong>Mobile no :</strong>
                ${participant1.mobile}
              </div>


              <div>

                <strong>Email :</strong>

                <a
                  href="mailto:${participant1.email}"
                >
                  ${participant1.email}
                </a>

              </div>


              <div>
                <strong>Event :</strong>
                ${event}
              </div>


              <div>
                <strong>Day :</strong>
                ${day}
              </div>


              <div>
                <strong>Date :</strong>
                ${date ?? ""}
              </div>


              ${participant2Html}


              <div style="margin-top:12px;">

                <strong>ID :</strong>
                ${registrationId}

              </div>

            </td>

          </tr>

        </table>

      </td>

    </tr>

  </table>

</body>

</html>
`;

    /* -----------------------------------------
       SEND EMAIL
    ----------------------------------------- */

    await transporter.sendMail({
      from: `"SPARDHA 2K26" <${smtpUser}>`,
      to: participant1.email,
      subject: "SPARDHA 2K26 Registration Confirmation",
      html,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent successfully",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Email sending error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
