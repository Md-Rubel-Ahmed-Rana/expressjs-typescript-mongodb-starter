import { BcryptInstance } from "@/lib/bcrypt";
import { IUser } from "../users/users.interface";
import { UserService } from "../users/users.service";
import {
  IChangePassword,
  ILoginCredentials,
  ILoginResponse,
  IResetPassword,
} from "@/interfaces/common.interface";
import { USER_STATUS } from "../users/users.enum";
import { OTPService } from "../otp/otp.service";
import ApiError from "@/middlewares/error";
import { Types } from "mongoose";
import { IOtpVerify } from "../otp/otp.interface";
import { JwtInstance } from "@/lib/jwt";
import { HttpStatusCode } from "@/lib/httpStatus";

class Service {
  async register(data: IUser) {
    data.password = await BcryptInstance.hash(data.password);

    await UserService.create(data);
  }

  async login(data: ILoginCredentials): Promise<{
    access_token: string;
    refresh_token: string;
    user: IUser;
  }> {
    const user = await UserService.getUserByDynamicKeyValue(
      "email",
      data.email
    );
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    if (user.status === USER_STATUS.INACTIVE) {
      // send a verification link or otp

      throw new ApiError(
        HttpStatusCode.UNAUTHORIZED,
        "Your account is not activated yet. We've sent a verification otp. Please check SMS & verify to access your account"
      );
    }

    if (user.status === USER_STATUS.BANNED) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your account has been banned.  You can't access your account. Please contact to support team to activate your account"
      );
    }

    const isPasswordMatched = await BcryptInstance.compare(
      data.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new ApiError(
        HttpStatusCode.UNAUTHORIZED,
        "Invalid credentials. Please try with valid credentials"
      );
    }

    await UserService.updateUserById(user._id as Types.ObjectId, {
      last_login_at: new Date(),
    });

    return await this.generateLoginCredentials(user._id as Types.ObjectId);
  }

  async verifyAccount(data: IOtpVerify): Promise<{
    access_token: string;
    refresh_token: string;
    user: IUser;
  }> {
    const user = await UserService.getUserByDynamicKeyValue(
      "email",
      data.credential
    );

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }

    // prevent already verified account
    if (user?.status === USER_STATUS.ACTIVE) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your account already verified. Please login to your account"
      );
    }
    // verify otp
    await OTPService.verifyOTP(data);

    // update status to active
    await UserService.updateUserById(user._id as Types.ObjectId, {
      status: USER_STATUS.ACTIVE,
      last_login_at: new Date(),
      is_verified: true,
    });

    return this.generateLoginCredentials(user._id as Types.ObjectId);
  }

  async getLoggedInUser(id: string) {
    const user = await UserService.getUserByIdWithoutPassword(id);

    if (user?.status === USER_STATUS.BANNED) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Your account has been banned.  You can't access your account. Please contact to support team to activate your account"
      );
    }
    return user;
  }

  async resendVerificationOtp(phone_number: string) {
    // await UserService.getUserByPhoneNumber(phone_number);
    // send verification link or otp
    console.log(phone_number);
  }

  async resetPassword(data: IResetPassword) {
    console.log(data);
    const user = await UserService.getUserByDynamicKeyValue(
      "email",
      data.email
    );

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }

    const newPassword = await BcryptInstance.hash(data.password);

    await UserService.updateUserById(user._id, { password: newPassword });

    return this.generateLoginCredentials(user._id);
  }

  async changePassword(id: string, data: IChangePassword) {
    const user: any = await UserService.getUserByIdWithPassword(id);

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
        "Same password couldn't be changed. Please provide a new different password"
      );
    }

    const newPassword = await BcryptInstance.hash(data.new_password);

    await UserService.updateUserById(user._id, { password: newPassword });
  }

  async forgetPassword(phone_number: string) {
    await UserService.getUserByDynamicKeyValue("phone_number", phone_number);

    await OTPService.sendForgetPasswordOtp(phone_number);
  }

  private async generateLoginCredentials(
    id: Types.ObjectId | string
  ): Promise<ILoginResponse> {
    const user: any = await UserService.getUserByIdWithoutPassword(id);

    const payload: any = {
      id: user?._id.toString(),
      phone_number: user?.phone_number as string,
      role: user?.role as string,
    };
    const { access_token, refresh_token } =
      await JwtInstance.generateTokens(payload);

    return {
      user: user,
      access_token,
      refresh_token,
    };
  }

  async googleLogin(data: IUser): Promise<ILoginResponse> {
    const isExist: any = await UserService.getUserByDynamicKeyValue(
      "email",
      data?.email
    );

    if (isExist) {
      return await this.generateLoginCredentials(isExist?._id);
    } else {
      const result: any = await UserService.create(data);
      return await this.generateLoginCredentials(result?._id);
    }
  }
}

export const AuthService = new Service();
