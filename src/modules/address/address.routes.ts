import { Router } from "express";
import { AddressController } from "./address.controller";
import validateRequest from "@/middlewares/validateRequest";
import { addressValidation } from "./address.validator";

const router: Router = Router();

router
  .route("/")
  .post(
    validateRequest(addressValidation.createAddressSchema),
    AddressController.create
  );

router
  .route("/:id")
  .get(AddressController.getAddressById)
  .delete(AddressController.deleteAddress)
  .patch(
    validateRequest(addressValidation.updateAddressSchema),
    AddressController.updateAddress
  );

router.route("/user/:userId").get(AddressController.getAddressesByUserId);
