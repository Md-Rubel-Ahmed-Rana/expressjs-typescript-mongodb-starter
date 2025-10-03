import mongoose, { Types } from "mongoose";
import { IAddress } from "./address.interface";
import { AddressModel } from "./address.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";

class Service {
  async create(data: IAddress, session?: mongoose.mongo.ClientSession) {
    const result = await AddressModel.create([data], { session });

    return result[0];
  }

  async updateAddress(id: Types.ObjectId, data: Partial<IAddress>) {
    const updated = await AddressModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updated) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "Address was not found to update"
      );
    }

    return updated;
  }
}

export const AddressService = new Service();
