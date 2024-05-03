import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { JwtMiddleware } from "../middlewares/JwtMiddleware";
import validateRequest from "../middlewares/validateRequest";
import { userValidationSchema } from "../validators/user.validator";
import checkAuthorization from "../middlewares/authorizeMiddleware";

const router = Router();

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request body
 */
router.post(
  "/register",
  validateRequest(userValidationSchema.postUserSchema),
  UserController.register
);

router.post(
  "/register",
  validateRequest(userValidationSchema.postUserSchema),
  UserController.register
);

router.post(
  "/login",
  validateRequest(userValidationSchema.loginUserSchema),
  UserController.login
);

router.get("/auth", JwtMiddleware.authenticate, UserController.auth);

router.get("/", UserController.findUsers);

router.get("/single/:id", UserController.findSingleUserById);

router.patch(
  "/update/:id",
  JwtMiddleware.authenticate,
  checkAuthorization("admin", "super admin"),
  validateRequest(userValidationSchema.updateUserSchema),
  UserController.updateUser
);

router.delete(
  "/delete/:id",
  JwtMiddleware.authenticate,
  checkAuthorization("admin", "super admin"),
  UserController.deleteUser
);

export const UserRoutes = router;
