import { upload } from "@/config/multer";
import { UserMiddleware } from "@/middlewares/upload.user.middleware";
import { Router } from "express";
import { UserController } from "../users.controller";
import { JwtInstance } from "@/lib/jwt";

const router = Router();

router.patch("/:id", JwtInstance.authenticate(), UserController.updateUser);

router.patch(
  "/:id/profile-picture",
  JwtInstance.authenticate(),
  upload.single("profile_picture"),
  UserMiddleware.uploadUserProfilePicture,
  UserController.updateProfilePicture
);

export const UserPublicRoutes = router;
