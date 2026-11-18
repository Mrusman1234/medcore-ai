import nodemailer from "nodemailer";
import { Appointment } from "@/lib/types";

export interface SendAppointmentEmailParams {
  appointment: Appointment;
  type: "booked" | "confirmed" | "rescheduled" | "cancelled";
  customMessage?: string;
}

export async function sendAppointmentNotificationEmail({
  appointment,
  type,
  customMessage,
}: SendAppointmentEmailParams): Promise<{
  success: boolean;
  simulated: boolean;
  messageId?: string;
  error?: string;
}> {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || "MedCore AI Clinic <no-reply@medcore.ai>";

  // If SMTP credentials are not configured, perform a graceful simulation
  if (!smtpUser || !smtpPass) {
    console.log(
      `[MedCore AI Mailer] SMTP credentials not set. Simulated notification for appointment ${appointment.id} (${type}) to ${appointment.patientEmail}.`
    );
    return {
      success: true,
      simulated: true,
      messageId: `simulated_${Date.now()}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const statusTitles = {
      booked: "Appointment Requested & In Review",
      confirmed: "Appointment Confirmed — MedCore AI",
      rescheduled: "Appointment Rescheduled — MedCore AI",
      cancelled: "Appointment Cancelled — MedCore AI",
    };

    const statusColors = {
      booked: "#F59E0B",
      confirmed: "#10B981",
      rescheduled: "#0EA5E9",
      cancelled: "#EF4444",
    };

    const title = statusTitles[type] || "MedCore AI Appointment Notice";
    const accentColor = statusColors[type] || "#0D9488";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090D16; color: #F8FAFC; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background-color: #0F172A; border: 1px solid #1E293B; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #090D16 0%, #0F172A 100%); padding: 24px; border-bottom: 1px solid #1E293B; text-align: center; }
          .brand { font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; }
          .brand-accent { color: #06B6D4; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background-color: ${accentColor}20; color: ${accentColor}; border: 1px solid ${accentColor}40; margin-top: 12px; }
          .content { padding: 32px 24px; }
          .card { background-color: #131E33; border: 1px solid #1E293B; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1E293B; font-size: 14px; }
          .row:last-child { border-bottom: none; }
          .label { color: #94A3B8; font-weight: 500; }
          .value { color: #F8FAFC; font-weight: 600; text-align: right; }
          .footer { padding: 20px 24px; background-color: #090D16; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #1E293B; }
          .button { display: inline-block; background: linear-gradient(135deg, #0D9488 0%, #06B6D4 100%); color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">Med<span class="brand-accent">Core</span> AI</div>
            <div style="font-size: 11px; color: #64748B; letter-spacing: 1.5px; margin-top: 4px;">SMART CLINIC &amp; TELEMEDICINE</div>
            <div class="badge">${type}</div>
          </div>
          <div class="content">
            <h2 style="margin-top: 0; font-size: 18px; color: #FFFFFF;">Hello ${appointment.patientName},</h2>
            <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">
              ${
                customMessage ||
                `Your clinical consultation at MedCore AI has been updated to <strong>${type.toUpperCase()}</strong>. Here are your consultation details:`
              }
            </p>

            <div class="card">
              <div class="row">
                <span class="label">Reference ID:</span>
                <span class="value">${appointment.id}</span>
              </div>
              <div class="row">
                <span class="label">Specialist Physician:</span>
                <span class="value">${appointment.doctorName} (${appointment.doctorSpecialty})</span>
              </div>
              <div class="row">
                <span class="label">Date:</span>
                <span class="value">${appointment.dateString}</span>
              </div>
              <div class="row">
                <span class="label">Time Slot:</span>
                <span class="value">${appointment.timeSlot}</span>
              </div>
              <div class="row">
                <span class="label">Consultation Reason:</span>
                <span class="value">${appointment.reason}</span>
              </div>
              <div class="row">
                <span class="label">Session Format:</span>
                <span class="value">Secure High-Def Telemedicine / Virtual Clinic</span>
              </div>
            </div>

            <div style="background-color: #064E3B20; border: 1px solid #10B98130; border-radius: 8px; padding: 14px; margin-top: 16px;">
              <p style="color: #34D399; font-size: 13px; margin: 0; line-height: 1.5;">
                🩺 <strong>Clinical Preparation:</strong> Please ensure your vitals (if available) and any current medications list are ready before the consultation. You can access the clinical portal anytime.
              </p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/patient" class="button">Access Patient Portal</a>
            </div>
          </div>

          <div class="footer">
            MedCore AI Institute of Medicine &amp; Virtual Care &bull; HIPAA Compliant 256-bit Encryption<br/>
            If you need to make urgent changes, contact triage@medcore.ai or call +1 (800) MED-CORE.
          </div>
        </div>
      </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: emailFrom,
      to: appointment.patientEmail,
      subject: `${title} - ${appointment.dateString} at ${appointment.timeSlot}`,
      html: htmlContent,
    });

    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("[MedCore AI Mailer] Failed to send email via SMTP:", error);
    return {
      success: false,
      simulated: false,
      error: error?.message || "Failed to send email notification",
    };
  }
}
