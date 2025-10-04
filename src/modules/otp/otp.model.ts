import { Schema, model } from "mongoose";
import { IOTP } from "./otp.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const OtpSchema = new Schema<IOTP>(
  {
    credential: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  schemaOptions
);

// TTL index (auto-delete when expireAt <= now)
OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = model<IOTP>("Otp", OtpSchema);
