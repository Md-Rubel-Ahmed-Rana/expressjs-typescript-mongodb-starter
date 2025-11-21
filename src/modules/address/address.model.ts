import { model, Schema } from "mongoose";
import { IAddress } from "./address.interface";
import { schemaOptions } from "@/utils/schemaOptions";

export const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    division: { type: String, required: true },
    postal_code: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    local_address: { type: String, required: true },
  },
  schemaOptions
);

export const AddressModel = model("Address", addressSchema);
