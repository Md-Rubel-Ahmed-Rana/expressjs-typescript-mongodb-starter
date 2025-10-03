import z from "zod";

export const resendOtp = z.object({
  body: z
    .object({
      phone_number: z.string({
        required_error: "Phone number is required",
      }),
    })
    .strict(),
});

const verifyOtp = z.object({
  body: z
    .object({
      phone_number: z.string({
        required_error: "Phone number is required",
      }),
      otp: z.number({
        required_error: "Otp must be provided",
        invalid_type_error: "Otp must be number",
      }),
    })
    .strict(),
});

export const otpValidations = { resendOtp, verifyOtp };
