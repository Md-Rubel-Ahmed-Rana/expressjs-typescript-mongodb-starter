import { Router } from "express";
import { EmailVerifyOtpController } from "./controller";
import validateRequest from "@/middlewares/validateRequest";
import { otpValidations } from "@/modules/otp/otp.validate";
import { resendEmailVerifyOtp } from "./validate";

const router = Router();

router.post(
  "/verify",
  validateRequest(otpValidations.verifyOtp),
  EmailVerifyOtpController.verifyOtp
);

router.post(
  "/resend",
  validateRequest(resendEmailVerifyOtp),
  EmailVerifyOtpController.resendEmailVerifyOtp
);

export const EmailVerifyOtpRoutes = router;
