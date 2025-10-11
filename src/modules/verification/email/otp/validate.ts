import z from "zod";

export const resendEmailVerifyOtp = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be string/text",
        })
        .min(3, "Name must be at least 3 characters"),
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Please provide a valid email" }),
    })
    .strict(),
});
