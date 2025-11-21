import { IAddress } from "./address.interface";
import { AddressModel } from "./address.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";

class Service {
  async create(data: IAddress) {
    return await AddressModel.create(data);
  }

  async getAddressById(id: Types.ObjectId) {
    const address = await AddressModel.findById(id);

    if (!address) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Address was not found");
    }
    return address;
  }

  async deleteAddress(id: Types.ObjectId) {
    const deleted = await AddressModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "Address was not found to delete"
      );
    }

    return deleted;
  }

  async getAddressesByUserId(userId: Types.ObjectId) {
    const addresses = await AddressModel.find({ user: userId });
    return addresses;
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
