import { Router } from "express";
import { PhoneVerifyController } from "./controller";
import validateRequest from "@/middlewares/validateRequest";
import { otpValidations } from "@/modules/otp/otp.validate";
import { resendPhoneVerifyOtp } from "./validate";

const router = Router();

router.post(
  "/verify",
  validateRequest(otpValidations.verifyOtp),
  PhoneVerifyController.verifyOtp
);

router.post(
  "/resend",
  validateRequest(resendPhoneVerifyOtp),
  PhoneVerifyController.resendVerifyOtp
);

export const PhoneVerifyRoutes = router;
