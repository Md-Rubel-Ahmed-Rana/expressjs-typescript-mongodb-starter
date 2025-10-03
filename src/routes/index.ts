import { Router } from "express";
import { PublicRoutes } from "./public.routes";
import { AdminRoutes } from "./admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { JwtInstance } from "@/lib/jwt";
import { ROLES } from "@/constants/roles";
const router = Router();

router.use("", PublicRoutes);

router.use("/auth", AuthRoutes);

router.use("/admin", JwtInstance.authenticate([ROLES.ADMIN]), AdminRoutes);

export const AppRoutes = router;
