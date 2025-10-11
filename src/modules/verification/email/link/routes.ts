import { Router } from "express";
import { EmailVerifyLinkController } from "./controller";

const router = Router();

router.post("/verify", EmailVerifyLinkController.verifyToken);

router.post("/resend", EmailVerifyLinkController.resendVerificationLink);

export const EmailVerifyLinkRoutes = router;
