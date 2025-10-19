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

export const verificationEmailOtpTemplate = (payload: {
  name: string;
  otp: number;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Account</title>
  <style>
    @media (max-width: 600px) {
      .container {
        margin: 20px;
      }
      .otp {
        font-size: 1.5rem;
        padding: 8px 16px;
      }
    }
  </style>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0;">
  <div class="container" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);overflow: hidden;">
    <div style" background-color: #4f46e5; color: #ffffff;padding: 20px;text-align: center;font-size: 1.5rem;font-weight: bold;">
      Verify Your Account
    </div>
    <div style="padding: 30px 20px;color: #333333;line-height: 1.6;text-align: center;">
      <p>Hi ${payload.name},</p>
      <p>Use the following OTP to verify your account. This code will expire in 5 minutes.</p>
      <div class="otp" style="display: inline-block;font-size: 2rem;font-weight: bold;color: #4f46e5;padding: 10px 20px;margin: 20px 0;border: 2px dashed #4f46e5;border-radius: 8px;letter-spacing: 4px;">${payload.otp}</div>
      <p>If you did not request this, please ignore this email.</p>
    </div>
    <div style=" padding: 20px;font-size: 0.85rem;color: #777777;text-align: center;border-top: 1px solid #e0e0e0;">
      &copy; ${new Date().getFullYear()} ${envConfig.app.name || "YourCompany"}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};

export const forgetPasswordEmailLinkTemplate = (payload: {
  name: string;
  link: string;
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en" style="margin:0;padding:0;">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;background-color: #f4f7fa;margin: 0;padding: 0;color: #333;">
      <div style="max-width: 600px;background-color: #ffffff;margin: 40px auto;border-radius: 12px;box-shadow: 0 4px 10px rgba(0,0,0,0.08);overflow: hidden;" class="container">
        <div style="background-color: #2563eb;color: white;text-align: center;padding: 30px 20px;" class="header">
          <h1 style="margin: 0;font-size: 24px;">Password Reset Request</h1>
        </div>
        <div style="padding: 30px;line-height: 1.6;" class="content">
          <p style="font-size: 16px;color: #444;">Hi ${payload.name},</p>
          <p style="font-size: 16px;color: #444;">We received a request to reset your password. You can reset it by clicking the button below:</p>
          <p style="text-align: center; font-size: 16px;color: #444; display: inline-block;background-color: #2563eb;color: #fff;padding: 12px 24px;border-radius: 8px;text-decoration: none;font-weight: 500;margin: 20px 0;">
            <a href="${payload.link}" class="button" target="_blank">Reset Password</a>
          </p>
          <p style="font-size: 16px;color: #444;">If you didn’t request this, you can safely ignore this email — your password will remain unchanged.</p>
          <p style="font-size: 16px;color: #444;">This link will expire in <strong>1 hour</strong> for your security.</p>
          <p style="font-size: 16px;color: #444;">Thank you,<br>The Support Team</p>
        </div>
        <div style="text-align: center;font-size: 14px;color: #888;padding: 20px;border-top: 1px solid #eaeaea;" class="footer">
          <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>
            <a style="color: #2563eb;text-decoration: none;" href="#">Privacy Policy</a> • <a style="color: #2563eb;text-decoration: none;" href="#">Contact Support</a>
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
};

export const login2FAAuthEmailLinkTemplate = (payload: {
  name: string;
  link: string;
}) => {
  const { name, link } = payload;

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Two-Factor Authentication</title>
      <style>
        .btn:hover {
          background-color: #1d4ed8;
        }
        a.link {
          color: #2563eb;
          word-break: break-all;
        }
      </style>
    </head>
    <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;background-color: #f4f6f8;margin: 0;padding: 0;">
      <div style=" max-width: 600px;margin: 40px auto;background: #ffffff;border-radius: 12px;box-shadow: 0 2px 8px rgba(0,0,0,0.05);overflow: hidden;" class="container">
        <div style=" background-color: #2563eb;color: #ffffff;text-align: center;padding: 30px 20px;" class="header">
          <h1 style="margin: 0;font-size: 22px;letter-spacing: 0.5px;">Two-Factor Authentication</h1>
        </div>
        <div style="padding: 30px 40px;color: #333333;line-height: 1.6;" class="content">
          <p style="margin: 12px 0;font-size: 15px;">Hi ${name || "there"},</p>
          <p style="margin: 12px 0;font-size: 15px;">We noticed a login attempt to your account that requires two-factor authentication (2FA).</p>
          <p style="margin: 12px 0;font-size: 15px;">Please click the button below to verify your identity and complete your login:</p>

          <div style="text-align: center;margin: 30px 0;" class="btn-container">
            <a style="background-color: #2563eb;color: #ffffff !important;text-decoration: none;padding: 12px 28px;border-radius: 6px;font-weight: 600;display: inline-block;transition: background-color 0.2s ease;" href="${link}" target="_blank" class="btn">Verify Login</a>
          </div>

          <p style="margin: 12px 0;font-size: 15px;">If the button above doesn't work, you can also use the link below:</p>
          <p style="margin: 12px 0;font-size: 15px;"><a href="${link}" class="link" target="_blank">${link}</a></p>

          <p style="margin: 12px 0;font-size: 15px;">If you did not attempt to log in, please secure your account immediately by changing your password.</p>
        </div>
        <div style=" background-color: #f9fafb;text-align: center;padding: 20px;font-size: 13px;color: #777777;" class="footer">
          <p>© ${new Date().getFullYear()} Your Restaurant. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};
