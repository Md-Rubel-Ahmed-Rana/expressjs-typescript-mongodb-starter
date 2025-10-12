import { Router } from "express";
import { PhoneVerifyController } from "./controller";
import validateRequest from "@/middlewares/validateRequest";
import { otpValidations } from "@/modules/otp/otp.validate";

const router = Router();

router.post(
  "/verify",
  validateRequest(otpValidations.verifyOtp),
  PhoneVerifyController.verifyOtp
);

export const PhoneVerifyRoutes = router;
