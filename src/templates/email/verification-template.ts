import { envConfig } from "@/config/index";

export const verificationEmailTemplate = (payload: {
  name: string;
  email: string;
  link: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body
    style="
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f5f7fa;
      color: #333;
      margin: 0;
      padding: 0;
    "
  >
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"
    >
      <tr>
        <td style="padding: 40px 40px 30px 40px; text-align: center;">
          <img
            src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
            alt="Verify Email"
            width="60"
            height="60"
            style="margin-bottom: 20px;"
          />
          <h2 style="color: #111827; font-size: 24px; margin: 0;">Verify your email address</h2>
        </td>
      </tr>

      <tr>
        <td style="padding: 0 40px 30px 40px; text-align: left;">
          <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Hi <strong>${payload.name}</strong>,
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for signing up! Please confirm that <strong>${payload.email}</strong> is your email address by clicking the button below.
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a
              href="${payload.link}"
              target="_blank"
              style="
                background-color: #2563eb;
                color: #ffffff;
                padding: 12px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;
                display: inline-block;
              "
            >
              Verify Email
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.5; color: #555;">
            This verification link will expire in <strong>30 minutes</strong> for security reasons.
            If you didn’t create an account with us, you can safely ignore this email.
          </p>

          <p style="font-size: 14px; margin-top: 32px; color: #6b7280;">
            — The ${envConfig.app.name || "Support"} Team
          </p>
        </td>
      </tr>

      <tr>
        <td
          style="
            background-color: #f3f4f6;
            padding: 16px 40px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
          "
        >
          &copy; ${new Date().getFullYear()} ${envConfig.app.name || "Your Company"}. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
