import { Router } from "express";
import { UserController } from "../users.controller";
import { upload } from "@/config/multer";
import { UserMiddleware } from "@/middlewares/upload.user.middleware";

const router = Router();

router.post(
  "/",
  upload.single("profile_picture"),
  UserMiddleware.uploadUserProfilePictureByAdmin,
  UserController.createUserByAdmin
);

router.get("/", UserController.getAllUsers);

router.patch("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteAccount);

export const UserAdminRoutes = router;
