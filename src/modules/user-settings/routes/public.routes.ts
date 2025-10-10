import { Router } from "express";
import { UserSettingController } from "../user-settings.controller";
import { JwtInstance } from "@/lib/jwt";

const router = Router();

router.get(
  "/",
  JwtInstance.authenticate(),
  UserSettingController.getMySettings
);

export const UserSettingPublicRoutes = router;
