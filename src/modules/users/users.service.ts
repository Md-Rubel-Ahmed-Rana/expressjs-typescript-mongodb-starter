import ApiError from "@/middlewares/error";
import { IUser, IUserFilters } from "./users.interface";
import { UserModel } from "./users.model";
import { HttpStatusCode } from "@/lib/httpStatus";
import { BcryptInstance } from "@/lib/bcrypt";
import { Types } from "mongoose";
import { IChangePassword } from "@/interfaces/common.interface";
import { emitter } from "@/events/eventEmitter";
import { IPaginationOptions } from "@/interfaces/pagination.interfaces";
import { paginationHelpers } from "@/helpers/paginationHelpers";
import { userSearchableFields } from "./users.constants";
import { USER_STATUS } from "./users.enum";
import { UUIDService } from "@/lib/uuid";
import { PhoneVerifyService } from "../verification/phone/service";
import { envConfig } from "@/config/index";
import { EmailVerifyLinkService } from "../verification/email/link/service";
import { EmailVerifyOTPService } from "../verification/email/otp/service";

class Service {
  async create(data: IUser) {
    const isExist = await UserModel.findOne({
      email: data.email,
    });

    if (isExist) {
      throw new ApiError(
        HttpStatusCode.CONFLICT,
        `You already have an account. Please login to your account`
      );
    }

    // generate username
    if (data?.email) {
      data.username = this.generateUserName(data.email) ?? "";
    }

    if (envConfig.app.default_verification_method === "phone") {
      // validate phone number
      if (!data.phone_number) {
        throw new ApiError(
          HttpStatusCode.BAD_REQUEST,
          "Phone number is required"
        );
      }
      // send verification otp to phone number
      await PhoneVerifyService.sendPhoneVerifyOtp(data.phone_number);
    }

    if (envConfig.app.default_verification_method === "email") {
      if (envConfig.app.default_email_verify_method === "link") {
        // send verification link to email
        await EmailVerifyLinkService.sendVerificationLink({
          email: data.email,
          name: data.name,
        });
      }

      if (envConfig.app.default_email_verify_method === "otp") {
        // send verification otp to email
        await EmailVerifyOTPService.sendEmailVerifyOtp({
          email: data.email,
          name: data.name,
        });
      }
    }

    const result = await UserModel.create(data);

    // fire event for a new user
    emitter.emit("user.registered", result._id);

    return result;
  }

  async getLoggedInUser(id: string) {
    const user = await UserModel.findById(id).select({ password: 0 });

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found!");
    }

    if (user?.status === USER_STATUS.BANNED) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your account has been banned.  You can't access your account. Please contact to support team to activate your account"
      );
    }

    return user;
  }

  async getAllUsers(
    options: IPaginationOptions,
    filters: IUserFilters,
    search_query: string
  ) {
    const {
      limit = 10,
      page = 1,
      skip,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = paginationHelpers.calculatePagination(options);

    const { role, status } = filters;

    const andConditions: any = [];

    // search
    if (search_query) {
      andConditions.push({
        $or: userSearchableFields.map((field: string) => {
          return {
            [field]: {
              $regex: search_query,
              $options: "i",
            },
          };
        }),
      });
    }

    // filters
    if (role) {
      andConditions.push({
        role,
      });
    }

    if (status) {
      andConditions.push({
        status,
      });
    }
    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const result = await UserModel.find(whereConditions)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .select({ password: 0 });

    const total = await UserModel.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  async changePassword(id: string, data: IChangePassword) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found!");
    }

    const isPasswordMatched = await BcryptInstance.compare(
      data.old_password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your old password is wrong. Please provide your correct password"
      );
    }

    const isSamePassword = await BcryptInstance.compare(
      data.new_password,
      user.password
    );

    if (isSamePassword) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Same password couldn't be changed. Please provide a different password"
      );
    }

    const newPassword = await BcryptInstance.hash(data.new_password);

    await UserModel.findByIdAndUpdate(user._id, { password: newPassword });
  }

  async updateProfilePicture(id: string, profile_picture: string) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found!");
    }

    const result = await UserModel.findByIdAndUpdate(
      user._id,
      { profile_picture },
      { new: true }
    ).select({ password: 0 });

    // emit event to delete old image from AWS
    if (user?.profile_picture) {
      console.log("[UserService] Delete old profile picture", user?.name);
      emitter.emit("s3.file.deleted", user?.profile_picture);
    } else {
      console.log(
        "[UserService] User has no old profile picture: ",
        user?.name
      );
    }

    return result;
  }

  async getUserByIdWithPassword(id: string | Types.ObjectId) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return user;
  }

  async getUserByIdWithoutPassword(id: string | Types.ObjectId) {
    const user = await UserModel.findById(id).select({ password: 0 });
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return user;
  }

  async getUserByDynamicKeyValue(
    key: keyof IUser,
    value: string | number
  ): Promise<IUser | null> {
    return await UserModel.findOne({ [key]: value });
  }

  async getUserByEmailOrPhoneNumber(credential: string) {
    return await UserModel.findOne({
      $or: [{ phone_number: credential }, { email: credential }],
    });
  }

  async updateUserById(id: string | Types.ObjectId, data: Partial<IUser>) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).select({
      password: 0,
    });
  }

  async deleteAccount(id: Types.ObjectId) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return { id };
  }

  private generateUserName(email: string) {
    if (!email) {
      return;
    }
    const uuidPart = UUIDService.generateFirstPart();
    const emailPrefix = email.split("@")[0].replace(/\./g, "").toLowerCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${emailPrefix}${randomNum}${uuidPart}`;
  }
}

export const UserService = new Service();
