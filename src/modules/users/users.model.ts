import { Schema, model } from "mongoose";
import { IUser } from "./users.interface";
import { ROLES } from "@/constants/roles";
import { schemaOptions } from "@/utils/schemaOptions";
import { USER_STATUS } from "./users.enum";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    profile_picture: { type: String, default: "" },
    email: { type: String, default: "" },
    role: { type: String, default: ROLES.CUSTOMER },
    is_verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: "inactive",
    },
    date_of_birth: { type: Date, default: null },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    last_login_at: { type: Date, default: null },
  },
  schemaOptions
);

export const UserModel = model<IUser>("User", userSchema);
