import { Router } from "express";
import { AuthController } from "./auth.controller";
import { JwtInstance } from "@/lib/jwt";

const router = Router();

router.post("/register", AuthController.register);

router.post("/verify-otp", AuthController.verifyAccount);

router.post("/resend-otp", AuthController.resendVerificationOtp);

router.get("/", JwtInstance.authenticate(), AuthController.getLoggedInUser);

router.post("/forget-password", AuthController.forgetPassword);

router.post("/reset-password", AuthController.resetPassword);

router.post("/login", AuthController.login);

router.post(
  "/change-password",
  JwtInstance.authenticate(),
  AuthController.changePassword
);

export const AuthRoutes = router;
