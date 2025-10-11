import { Router } from "express";
import { EmailVerifyLinkController } from "./controller";

const router = Router();

router.post("/verify", EmailVerifyLinkController.verifyToken);

export const EmailVerifyLinkRoutes = router;
