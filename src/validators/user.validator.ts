import { z as Zod } from "zod";

const postUserSchema = Zod.object({
  body: Zod.object({
    name: Zod.string({
      invalid_type_error: "Name must be string",
      required_error: "Name is required",
    })
      .min(3, "Name must have 3 characters or more")
      .max(15, "Name must have 15 characters or less"),
    email: Zod.string({
      invalid_type_error: "Email must be string",
      required_error: "Email is required",
    }).email("You provided an invalid email, Please enter a valid email"),
    password: Zod.string({
      invalid_type_error: "Password must be string",
      required_error: "Password is required",
    })
      .min(6, "Password must have 6 characters or more")
      .max(15, "Password must have 15 characters or less"),
  }),
});

const loginUserSchema = Zod.object({
  body: Zod.object({
    email: Zod.string({
      invalid_type_error: "Email must be string",
      required_error: "Email is required",
    }).email("You provided an invalid email, Please enter a valid email"),
    password: Zod.string({
      invalid_type_error: "Password must be string",
      required_error: "Password is required",
    })
      .min(6, "Password must have 6 characters or more")
      .max(15, "Password must have 15 characters or less"),
  }),
});

export const userValidationSchema = { postUserSchema, loginUserSchema };
