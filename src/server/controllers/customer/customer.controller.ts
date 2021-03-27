import {
  controller,
  request,
  response,
  requestParam,
  httpDelete,
  httpGet
} from "inversify-express-utils";
import { BaseController, mapConcurrently, NotFoundError } from "@app/data/util";
import { ExtractedDefaulter } from "@app/services/extraction";
import { Request, Response } from "express";
import { DefaulterRepo, Defaulters } from "@app/data/defaulter";
import { canCreateDefaulters } from "../defaulter/defaulter.middleware";
import { Defaulter } from "@app/services/defaulter";

type ControllerResponse = ExtractedDefaulter[] | Defaulters[] | Defaulters;

@controller("/customer")
export class CustomerController extends BaseController<ControllerResponse> {
  @httpDelete("/:request_id", canCreateDefaulters)
  async deleteUniqueDefaulters(
    @request() req: Request,
    @response() res: Response,
    @requestParam("request_id") request_id: string
  ) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, request_id);

      if (defaulters.length === 0) {
        throw new NotFoundError("We could not find any defaulter with such request id");
      }

      await mapConcurrently(defaulters, async d => {
        await DefaulterRepo.deleteDefaulter(d);
      });

      this.handleSuccess(req, res, null);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:request_id", canCreateDefaulters)
  async getUniqueDefaulters(
    @request() req: Request,
    @response() res: Response,
    @requestParam("request_id") request_id: string
  ) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await DefaulterRepo.getUniqueDefaulters(workspace, request_id);

      const defaultUsers = await Defaulter.getDefaultUsers(defaulters);

      this.handleSuccess(req, res, defaultUsers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
