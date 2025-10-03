import { ROLES } from "@/constants/roles";
import z from "zod";

const create = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be string/text",
        })
        .min(3, "Name must be at least 3 characters"),
      phone_number: z.string({
        required_error: "Phone number is required",
      }),
      email: z
        .string()
        .email({ message: "Please provide a valid email" })
        .optional(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(15, "Password must be less than 15 characters"),
      role: z.enum([...Object.values(ROLES)] as [string, ...string[]], {
        required_error: "User role is required",
      }),
    })
    .strict(),
});

export const UserValidations = { create };
