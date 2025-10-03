import { NextFunction, Request, Response } from "express";
import ApiError from "./error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { AWSFileUploader } from "@/modules/aws/uploader";
import { UserService } from "@/modules/users/users.service";
import { ROLES } from "@/constants/roles";

class Middleware {
  async uploadUserProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const file = req.file;

    if (!file) {
      return next(
        new ApiError(HttpStatusCode.BAD_REQUEST, "Profile picture is required")
      );
    }

    try {
      const profile_picture = await AWSFileUploader.uploadSingleFile(
        file,
        "user/profile-pictures"
      );

      req.body.profile_picture = profile_picture;
      next();
    } catch (error) {
      next(
        new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Error uploading profile picture"
        )
      );
    }
  }

  async uploadUserProfilePictureByAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.body?.name) {
      return next(
        new ApiError(HttpStatusCode.BAD_REQUEST, "User name is required")
      );
    }

    if (!req.body?.phone_number) {
      return next(
        new ApiError(
          HttpStatusCode.BAD_REQUEST,
          "User phone_number is required"
        )
      );
    }

    if (!req.body?.password) {
      return next(
        new ApiError(HttpStatusCode.BAD_REQUEST, "User password is required")
      );
    }

    if (!req.body?.role) {
      return next(
        new ApiError(
          HttpStatusCode.BAD_REQUEST,
          `User role is required. Available roles are: ${Object.values(ROLES)}`
        )
      );
    }

    const isExist = await UserService.getUserByPhoneNumber(
      req.body?.phone_number
    );

    if (isExist) {
      return next(
        new ApiError(
          HttpStatusCode.CONFLICT,
          "User already exist with this phone number"
        )
      );
    }

    const file = req.file;

    if (file) {
      try {
        const profile_picture = await AWSFileUploader.uploadSingleFile(
          file,
          "user/profile-pictures"
        );

        req.body.profile_picture = profile_picture;
        next();
      } catch (error) {
        next(
          new ApiError(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Error uploading profile picture"
          )
        );
      }
    } else {
      next();
    }
  }
}

export const UserMiddleware = new Middleware();
