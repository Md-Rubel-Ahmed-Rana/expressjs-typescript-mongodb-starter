import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { UserSettingService } from "./user-settings.service";
import { HttpStatusCode } from "@/lib/httpStatus";

class Controller extends BaseController {
  getMySettings = this.catchAsync(async (req: Request, res: Response) => {
    const data = await UserSettingService.getMySettings(req?.user?.id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User settings retrieved successfully",
      data,
    });
  });
}

export const UserSettingController = new Controller();
