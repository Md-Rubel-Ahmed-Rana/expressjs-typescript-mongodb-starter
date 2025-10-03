import { AuthRoutes } from "@/modules/auth/auth.routes";
import { OTPRoutes } from "@/modules/otp/otp.route";
import { UserPublicRoutes } from "@/modules/users/routes/public.routes";
import { Router } from "express";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/otp",
    route: OTPRoutes,
  },
  {
    path: "/users",
    route: UserPublicRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export const PublicRoutes = router;
