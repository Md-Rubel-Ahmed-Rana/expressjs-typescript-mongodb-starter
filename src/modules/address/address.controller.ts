import BaseController from "@/shared/baseController";
import { AddressService } from "./address.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";

class Controller extends BaseController {
  create = this.catchAsync(async (req, res) => {
    const address = await AddressService.create(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Address created successfully",
      data: address,
    });
  });

  getAddressById = this.catchAsync(async (req, res) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const address = await AddressService.getAddressById(id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  });

  deleteAddress = this.catchAsync(async (req, res) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const address = await AddressService.deleteAddress(id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Address deleted successfully",
      data: address,
    });
  });
  getAddressesByUserId = this.catchAsync(async (req, res) => {
    const userId = req.params.userId as unknown as Types.ObjectId;
    const addresses = await AddressService.getAddressesByUserId(userId);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  });

  updateAddress = this.catchAsync(async (req, res) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const address = await AddressService.updateAddress(id, req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  });
}

export const AddressController = new Controller();
