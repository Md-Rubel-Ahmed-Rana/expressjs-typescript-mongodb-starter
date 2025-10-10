import { Router } from "express";
import { AuthController } from "./auth.controller";
import { JwtInstance } from "@/lib/jwt";
import passport from "passport";

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

// google route
router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthController.googleLogin
);

export const AuthRoutes = router;
