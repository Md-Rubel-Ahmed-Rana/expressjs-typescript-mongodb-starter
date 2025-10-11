import { Router } from "express";
import { EmailVerifyLinkRoutes } from "./link/routes";
import { EmailVerifyOtpRoutes } from "./otp/routes";

const router = Router();

router.use("/link", EmailVerifyLinkRoutes);

router.use("/otp", EmailVerifyOtpRoutes);

export const EmailVerifyRoutes = router;
