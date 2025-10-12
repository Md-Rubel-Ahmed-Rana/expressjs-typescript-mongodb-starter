import z from "zod";

export const resendPhoneVerifyOtp = z.object({
  body: z
    .object({
      phone_number: z.string({
        required_error: "phone_number is required",
      }),
    })
    .strict(),
});
