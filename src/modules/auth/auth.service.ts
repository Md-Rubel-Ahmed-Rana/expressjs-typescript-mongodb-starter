import { BcryptInstance } from "@/lib/bcrypt";
import { IUser } from "../users/users.interface";
import { UserService } from "../users/users.service";
import {
  I2FALoginResponse,
  IChangePassword,
  ILoginCredentials,
  ILoginResponse,
  IResetPassword,
} from "@/interfaces/common.interface";
import { USER_STATUS } from "../users/users.enum";
import ApiError from "@/middlewares/error";
import { Types } from "mongoose";
import { JwtInstance } from "@/lib/jwt";
import { HttpStatusCode } from "@/lib/httpStatus";
import { UserSettingService } from "../user-settings/user-settings.service";
import { EmailVerifyLinkService } from "../verification/email/link/service";

class Service {
  async register(data: IUser) {
    data.password = await BcryptInstance.hash(data.password);

    await UserService.create(data);
  }

  async login(
    data: ILoginCredentials
  ): Promise<ILoginResponse | I2FALoginResponse> {
    const user = await UserService.getUserByEmailOrPhoneNumber(data.credential);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    if (user.status === USER_STATUS.INACTIVE) {
      // send a verification link or otp
      throw new ApiError(
        HttpStatusCode.UNAUTHORIZED,
        "Your account is not activated yet. Please activate your account first"
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

    const is2FAEnabled = await UserSettingService.is2FAEnabled(user._id);

    if (is2FAEnabled) {
      const { channel, email_method } =
        await UserSettingService.getUserOtpChannelInfo(user._id);

      const verificationMethod = channel;
      const isVerificationEnabled = !!verificationMethod;
      let dynamicMessage = "";
      if (isVerificationEnabled) {
        const isPhoneVerification = verificationMethod === "phone";

        const verifySubMethod = isPhoneVerification
          ? "otp"
          : email_method === "otp"
            ? "otp"
            : "link";

        const displayMethod = isPhoneVerification ? "phone number" : "email";
        const displaySubMethod = verifySubMethod === "otp" ? "code" : "link";

        dynamicMessage = `Two-factor authentication is enabled. We've sent a verification ${displaySubMethod} to your ${displayMethod}. Please complete the verification to continue.`;
        // send 2FA verification email or otp

        if (channel === "email") {
          if (email_method === "link") {
            // send forget password link
            await EmailVerifyLinkService.send2FALoginAuthEmailLink(user?.email);
          } else if (email_method === "otp") {
            // send forget password otp
          }
        } else if (channel === "phone") {
          // send forget password otp SMS
        }

        return {
          is2FAEnabled,
          message: dynamicMessage,
          data: {
            shouldVerify: true,
            method: verifySubMethod, // 'otp' or 'link'
            channel: isPhoneVerification ? "phone" : "email",
          },
        };
      }
    }

    await UserService.updateUserById(user._id as Types.ObjectId, {
      last_login_at: new Date(),
    });

    return await this.generateLoginCredentials(user._id as Types.ObjectId);
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

  async forgetPassword(credential: string) {
    const user = await UserService.getUserByEmailOrPhoneNumber(credential);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }

    const { channel, email_method } =
      await UserSettingService.getUserOtpChannelInfo(user._id);

    const verificationMethod = channel;
    const isVerificationEnabled = !!verificationMethod;
    let dynamicMessage = "";
    if (isVerificationEnabled) {
      const isPhoneVerification = verificationMethod === "phone";

      const verifySubMethod = isPhoneVerification
        ? "otp"
        : email_method === "otp"
          ? "otp"
          : "link";

      const displayMethod = isPhoneVerification ? "phone number" : "email";
      const displaySubMethod = verifySubMethod === "otp" ? "code" : "link";

      dynamicMessage = `We've sent a verification ${displaySubMethod} to your ${displayMethod}.`;
    }

    if (channel === "email") {
      if (email_method === "link") {
        // send forget password link
        await EmailVerifyLinkService.sendForgetPasswordLink(user?.email);
      } else if (email_method === "otp") {
        // send forget password otp
      }
    } else if (channel === "phone") {
      // send forget password otp SMS
    }

    return { dynamicMessage };
  }

  async generateLoginCredentials(
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
