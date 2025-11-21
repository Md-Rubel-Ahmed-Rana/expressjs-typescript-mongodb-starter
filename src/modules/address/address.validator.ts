import z from "zod";

const createAddressSchema = z.object({
  label: z.string({ required_error: "Label is required" }),
  user: z.string({ required_error: "User ID is required" }),
  street: z.string({ required_error: "Street is required" }),
  city: z.string({ required_error: "City is required" }),
  district: z.string({ required_error: "District is required" }),
  division: z.string({ required_error: "Division is required" }),
  postal_code: z.string({ required_error: "Postal code is required" }),
  local_address: z.string({ required_error: "Local address is required" }),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

const updateAddressSchema = z.object({
  label: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  division: z.string().optional(),
  postal_code: z.string().optional(),
  local_address: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const addressValidation = {
  createAddressSchema,
  updateAddressSchema,
};
