import { Router } from "express";
import { AuthController } from "./auth.controller";
import { JwtInstance } from "@/lib/jwt";
import passport from "passport";
import validateRequest from "@/middlewares/validateRequest";
import { UserValidations } from "../users/users.validate";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidations.create),
  AuthController.register
);

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
