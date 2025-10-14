import { Router } from "express";
import { BkashRoutes } from "./bkash/bkash.routes";

const router = Router();

router.use("/bkash", BkashRoutes);

export const PaymentRoutes = router;
