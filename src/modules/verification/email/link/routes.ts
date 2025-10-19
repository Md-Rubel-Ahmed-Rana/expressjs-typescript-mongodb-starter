import { Router } from "express";
import { EmailVerifyLinkController } from "./controller";

const router = Router();

router.post("/verify", EmailVerifyLinkController.verifyToken);

router.post("/resend", EmailVerifyLinkController.resendVerificationLink);

router.post("/2fa", EmailVerifyLinkController.verify2FAAuthToken);

export const EmailVerifyLinkRoutes = router;
