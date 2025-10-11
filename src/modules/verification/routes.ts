import { Router } from "express";
import { EmailVerifyRoutes } from "./email/routes";
import { PhoneVerifyRoutes } from "./phone/routes";

const router = Router();

router.use("/email", EmailVerifyRoutes);

router.use("/phone", PhoneVerifyRoutes);

export const VerificationRoutes = router;
