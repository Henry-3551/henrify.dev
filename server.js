const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

const requiredEnv = [
  "RESEND_API_KEY",
  "TO_EMAIL",
  "FROM_EMAIL"
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.warn(
    "Missing required env vars:",
    missingEnv.join(", ")
  );
}

const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." }
});

const normalizeText = (value) => String(value || "").trim();
const countLinks = (value) => (value.match(/https?:\/\/|www\./gi) || []).length;

app.post("/api/contact", contactLimiter, async (req, res) => {
  const { name, email, subject, message, _gotcha, form_started_at } = req.body || {};

  if (_gotcha) {
    return res.status(204).end();
  }

  const safeNameInput = normalizeText(name);
  const safeEmailInput = normalizeText(email);
  const safeSubjectInput = normalizeText(subject || "New portfolio inquiry");
  const safeMessageInput = normalizeText(message);

  if (!safeNameInput || !safeEmailInput || !safeMessageInput) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  if (safeNameInput.length > 100 || safeSubjectInput.length > 120 || safeMessageInput.length > 2000) {
    return res.status(400).json({ error: "One or more fields are too long." });
  }

  if (safeMessageInput.length < 10) {
    return res.status(400).json({ error: "Message is too short." });
  }

  const linkCount = countLinks(safeMessageInput);
  if (linkCount > 2) {
    return res.status(400).json({ error: "Too many links in message." });
  }

  const startedAt = Number(form_started_at || 0);
  if (startedAt && Number.isFinite(startedAt)) {
    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs < 3000) {
      return res.status(400).json({ error: "Form submitted too quickly." });
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const fromAddress = process.env.FROM_EMAIL;
  const toAddress = process.env.TO_EMAIL;

  const safeName = escapeHtml(safeNameInput);
  const safeEmail = escapeHtml(safeEmailInput);
  const safeSubjectText = escapeHtml(safeSubjectInput);
  const safeMessage = escapeHtml(safeMessageInput).replace(/\n/g, "<br>");

  try {
    await resend.emails.send({
      from: `Henrify Portfolio <${fromAddress}>`,
      to: [toAddress],
      replyTo: safeEmailInput,
      subject: `[Portfolio] ${safeSubjectInput}`,
      text: `Name: ${safeNameInput}\nEmail: ${safeEmailInput}\nSubject: ${safeSubjectInput}\n\n${safeMessageInput}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background-color:#0f172a;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;">
              <tr>
                <td align="center" style="padding:28px 16px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background-color:#111827;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
                    <tr>
                      <td bgcolor="#10b981" style="padding:20px 24px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                        <div style="font-size:18px;font-weight:700;">New Portfolio Inquiry</div>
                        <div style="font-size:12px;opacity:0.9;margin-top:4px;">Henrify.dev contact form</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:22px 24px;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
                          <tr>
                            <td style="padding:6px 0;color:#94a3b8;width:120px;">Name</td>
                            <td style="padding:6px 0;font-weight:600;">${safeName}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0;color:#94a3b8;">Email</td>
                            <td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#34d399;text-decoration:none;font-weight:600;">${safeEmail}</a></td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0;color:#94a3b8;">Subject</td>
                            <td style="padding:6px 0;font-weight:600;">${safeSubjectText}</td>
                          </tr>
                        </table>
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border:1px solid #1f2937;border-radius:12px;background-color:#0b1220;">
                          <tr>
                            <td style="padding:14px 16px;">
                              <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Message</div>
                              <div style="font-size:14px;line-height:1.6;color:#e2e8f0;">${safeMessage}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 24px;border-top:1px solid #1f2937;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;">
                        Reply directly to this email to respond to the client.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return res.status(500).json({ error: "Email send failed." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
