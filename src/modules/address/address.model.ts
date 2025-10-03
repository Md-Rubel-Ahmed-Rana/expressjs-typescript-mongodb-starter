import { model, Schema } from "mongoose";
import { IAddress } from "./address.interface";
import { schemaOptions } from "@/utils/schemaOptions";

export const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: null },
    created_by: { type: Schema.Types.ObjectId, required: true },
    street: { type: String, default: null },
    city: { type: String, default: null },
    district: { type: String, default: null },
    division: { type: String, default: null },
    postal_code: { type: String, default: null },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  schemaOptions
);

export const AddressModel = model("Address", addressSchema);
