import { Types } from "mongoose";

export type IAddress = {
  label: string;
  user: Types.ObjectId;
  street: string;
  city: string;
  district: string;
  division: string;
  postal_code: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  local_address: string;
};
