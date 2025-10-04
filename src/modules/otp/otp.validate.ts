import z from "zod";

export const resendOtp = z.object({
  body: z
    .object({
      credential: z.string({
        required_error: "Credential is required",
      }),
    })
    .strict(),
});

const verifyOtp = z.object({
  body: z
    .object({
      credential: z.string({
        required_error: "Credential is required",
      }),
      otp: z.number({
        required_error: "Otp must be provided",
        invalid_type_error: "Otp must be number",
      }),
    })
    .strict(),
});

export const otpValidations = { resendOtp, verifyOtp };
