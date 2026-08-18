import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

function emailTemplate({ name, email, message }: { name: string; email: string; message: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Message — Rakesh K</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; font-family: 'Inter', system-ui, sans-serif; color: #e5e5e5; }
  </style>
</head>
<body style="background:#0a0a0a; padding: 0; margin: 0;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a; padding: 48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- Logo bar -->
          <tr>
            <td style="padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="display:inline-flex; align-items:center; justify-content:center; width:56px; height:40px; border:1px solid rgba(94,231,242,0.34); border-radius:10px; background:linear-gradient(145deg,#17232b 0%,#0a0a0a 62%,#07151c 100%); color:#ffffff; font-size:16px; font-weight:800; letter-spacing:-0.08em;">RK</div>
                  </td>
                  <td align="right">
                    <span style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.25); font-weight:500;">
                      Portfolio Inquiry
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding: 48px 0 36px;">
              <p style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.28); font-weight:500; margin-bottom:16px;">
                New Message Received
              </p>
              <h1 style="font-size:36px; font-weight:700; color:#ffffff; letter-spacing:-0.03em; line-height:1.1; margin:0;">
                You have a<br/>
                <span style="color:rgba(255,255,255,0.35); font-weight:300; font-style:italic;">new inquiry</span>
              </h1>
            </td>
          </tr>

          <!-- Sender card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);">
                <tr>
                  <td style="padding: 28px 32px;">
                    <p style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.22); font-weight:500; margin-bottom:8px;">
                      From
                    </p>
                    <p style="font-size:22px; font-weight:600; color:#ffffff; letter-spacing:-0.02em; margin-bottom:4px;">
                      ${name}
                    </p>
                    <a href="mailto:${email}"
                      style="font-size:13px; color:rgba(255,255,255,0.45); text-decoration:none; letter-spacing:0.01em;">
                      ${email}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.22); font-weight:500; margin-bottom:16px;">
                Message
              </p>
              <div style="border-left: 2px solid rgba(255,255,255,0.15); padding-left: 24px;">
                <p style="font-size:15px; line-height:1.8; color:rgba(255,255,255,0.7); white-space:pre-line;">
                  ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                </p>
              </div>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding-bottom: 48px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#ffffff;">
                    <a href="mailto:${email}"
                      style="display:inline-block; padding: 14px 32px; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; font-weight:600; color:#0a0a0a; text-decoration:none;">
                      Reply to ${name} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 32px; padding-bottom: 8px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border:1px solid rgba(94,231,242,0.24); border-radius:8px; color:rgba(255,255,255,0.3); font-size:9px; font-weight:800; letter-spacing:-0.08em;">RK</span>
                  </td>
                  <td align="right">
                    <p style="font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.18);">
                      rakesh160982@gmail.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 20px;">
              <p style="font-size:10px; letter-spacing:0.12em; color:rgba(255,255,255,0.12); line-height:1.8;">
                This message was submitted via the contact form on the Rakesh K portfolio<br/>
                © 2026 Rakesh K · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'rakesh160982@gmail.com',
      replyTo: email,
      subject: `New message from ${name} — Portfolio`,
      html: emailTemplate({ name, email, message }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
