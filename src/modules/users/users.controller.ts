import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { UserService } from "./users.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";
import pickQueries from "@/shared/pickQueries";
import { paginationFields } from "@/constants/paginationFields";
import { userFilterableFields } from "./users.constants";
import { IUserFilters } from "./users.interface";
import { Types } from "mongoose";

class Controller extends BaseController {
  createUserByAdmin = this.catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUserByAdmin(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Your account has been created successfully.",
      data: result,
    });
  });

  verifyAccount = this.catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.verifyAccount(req.body);
    // store tokens on cookie
    // cookieManager.setTokens(res, access_token, refresh_token);

    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your account has been verified and logged in successfully",
      data: result,
    });
  });

  resendVerificationOtp = this.catchAsync(
    async (req: Request, res: Response) => {
      await UserService.resendVerificationOtp(req.body.phone_number);
      this.sendResponse(res, {
        statusCode: HttpStatusCode.OK,
        success: true,
        message:
          " We've sent a verification code (SMS) to you phone number. Please verify to access your account",
        data: null,
      });
    }
  );

  getLoggedInUser = this.catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getLoggedInUser(req?.user?.id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Authenticated user retrieved successfully",
      data: user,
    });
  });

  getAllUsers = this.catchAsync(async (req: Request, res: Response) => {
    const options = pickQueries(req.query, paginationFields);
    const filters = pickQueries(
      req.query,
      userFilterableFields
    ) as IUserFilters;
    const search_query = req.query.search_query as string;
    const user = await UserService.getAllUsers(options, filters, search_query);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Users retrieved successfully",
      data: user,
    });
  });

  changePassword = this.catchAsync(async (req: Request, res: Response) => {
    await UserService.changePassword(req?.user?.id, req.body);
    cookieManager.clearTokens(res);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your password has been changed. Please login to your account",
      data: null,
    });
  });

  updateProfilePicture = this.catchAsync(
    async (req: Request, res: Response) => {
      const result = await UserService.updateProfilePicture(
        req?.params?.id,
        req.body.profile_picture
      );
      this.sendResponse(res, {
        statusCode: HttpStatusCode.OK,
        success: true,
        message: "User profile picture has been updated successfully",
        data: result,
      });
    }
  );

  updateUser = this.catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.updateUserById(req?.params?.id, req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User has been updated successfully",
      data: result,
    });
  });

  deleteAccount = this.catchAsync(async (req: Request, res: Response) => {
    const id = req?.params?.id as unknown as Types.ObjectId;
    const result = await UserService.deleteAccount(id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User has been deleted successfully",
      data: result,
    });
  });
}

export const UserController = new Controller();
