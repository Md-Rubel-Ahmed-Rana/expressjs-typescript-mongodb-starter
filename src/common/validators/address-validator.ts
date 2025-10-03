import z from "zod";

export const addressValidationSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  division: z.string().optional(),
  postal_code: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});
