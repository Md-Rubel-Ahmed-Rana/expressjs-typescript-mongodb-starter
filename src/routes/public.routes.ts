import { AuthRoutes } from "@/modules/auth/auth.routes";
import { OTPRoutes } from "@/modules/otp/otp.route";
import { PaymentRoutes } from "@/modules/payment/payment.routes";
import { UserSettingPublicRoutes } from "@/modules/user-settings/routes/public.routes";
import { UserPublicRoutes } from "@/modules/users/routes/public.routes";
import { VerificationRoutes } from "@/modules/verification/routes";
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
  {
    path: "/user-settings",
    route: UserSettingPublicRoutes,
  },
  {
    path: "/verification",
    route: VerificationRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export const PublicRoutes = router;
