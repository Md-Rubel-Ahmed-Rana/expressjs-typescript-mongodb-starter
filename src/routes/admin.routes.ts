import { UserAdminRoutes } from "@/modules/users/routes/admin.routes";
import { Router } from "express";

const router = Router();

const routes = [
  {
    path: "/users",
    route: UserAdminRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export const AdminRoutes = router;
