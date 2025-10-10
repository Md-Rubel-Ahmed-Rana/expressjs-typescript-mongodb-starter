import { IRoles } from "@/constants/roles";
import { IUser } from "@/modules/users/users.interface";
import { Types } from "mongoose";

export type IJWtPayload = {
  id: string | Types.ObjectId;
  phone_number: string;
  role: IRoles;
};

export type IChangePassword = {
  old_password: string;
  new_password: string;
};

export type ILoginCredentials = {
  phone_number: string;
  password: string;
};

export type IResetPassword = {
  phone_number: string;
  password: string;
};

export type ILoginResponse = {
  access_token: string;
  refresh_token: string;
  user: IUser;
};
