import { IRoles } from "@/constants/roles";
import { Document } from "mongoose";

export type IUser = {
  name: string;
  phone_number: string;
  profile_picture?: string;
  email?: string;
  role: string;
  is_verified?: boolean;
  password: string;
  status: IUserStatus;
  date_of_birth?: Date;
  gender?: "male" | "female";
  last_login_at?: Date;
} & Document;

type IUserStatus = "inactive" | "active" | "banned";

export type IUserFilters = {
  role: IRoles;
  status: "inactive" | "active";
};
