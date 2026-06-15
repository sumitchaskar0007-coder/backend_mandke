import nodemailer from "nodemailer";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createTransporter() {
  const port = Number(process.env.SMTP_PORT || 587);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER and SMTP_PASS are required to send emails");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function field(label, value) {
  return `<tr><td style="padding:6px 12px;font-weight:bold">${label}</td><td style="padding:6px 12px">${escapeHtml(value || "-")}</td></tr>`;
}

export function sendCollegeNotification(application) {
  const transporter = createTransporter();
  const collegeEmail =
    process.env.COLLEGE_EMAIL || "admissions.mandkecollege@gmail.com";

  return transporter.sendMail({
    from: `"Mandke College Website" <${process.env.SMTP_USER}>`,
    to: collegeEmail,
    replyTo: application.email,
    subject: `New admission application: ${application.fullName}`,
    html: `
      <h2>New admission application</h2>
      <table style="border-collapse:collapse">
        ${field("Name", application.fullName)}
        ${field("Date of birth", application.dob)}
        ${field("Phone", application.phone)}
        ${field("Email", application.email)}
        ${field("Parent / guardian phone", application.parentPhone)}
        ${field("Address", application.address)}
        ${field("Qualification", application.qualification)}
        ${field("Percentage", application.percentage)}
        ${field("Year", application.year)}
        ${field("Course", application.course)}
        ${field("Message", application.message)}
        ${field("Source", application.source)}
      </table>
    `,
  });
}

export function sendApplicantAutoReply(application) {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: `"Mandke College Admissions" <${process.env.SMTP_USER}>`,
    to: application.email,
    subject: "Your admission application was received - Mandke College",
    html: `
      <p>Dear ${escapeHtml(application.fullName)},</p>
      <p>Thank you for applying to Mandke College for ${escapeHtml(application.course)}.</p>
      <p>We have received your application. Our admissions team will contact you shortly.</p>
      <p>Regards,<br>Mandke College Admissions<br>
      <a href="mailto:admissions.mandkecollege@gmail.com">admissions.mandkecollege@gmail.com</a></p>
    `,
  });
}
