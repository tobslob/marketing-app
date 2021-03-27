import {
  controller,
  httpPost,
  request,
  response,
  httpGet,
  requestParam,
  queryParam,
  httpDelete
} from "inversify-express-utils";
import { BaseController, mapConcurrently, validate } from "@app/data/util";
import { isUpload, canCreateDefaulters } from "./defaulter.middleware";
import { Extractions, ExtractedDefaulter } from "@app/services/extraction";
import { Request, Response } from "express";
import { Defaulter } from "@app/services/defaulter";
import { DefaulterRepo, Defaulters, DefaulterQuery } from "@app/data/defaulter";
import { isDefaulterQuery } from "./defaulter.validator";

type ControllerResponse = ExtractedDefaulter[] | Defaulters[] | Defaulters;

@controller("/defaulters")
export class DefaultersController extends BaseController<ControllerResponse> {
  @httpPost("/bulk/extract", canCreateDefaulters, isUpload)
  async extractDefaulters(@request() req: Request, @response() res: Response) {
    try {
      const workspace = req.session.workspace;
      const defaulters = await Extractions.extractDefaulters(req.file);

      const cratedDefaulters = await mapConcurrently(defaulters, async defaulter => {
        return await Defaulter.createDefaulters(req, workspace, defaulter);
      });

      const defaultUsers = await Defaulter.getDefaultUsers(cratedDefaulters);

      this.handleSuccess(req, res, defaultUsers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", canCreateDefaulters, validate(isDefaulterQuery))
  async getAllDefaulters(@request() req: Request, @response() res: Response, @queryParam() query: DefaulterQuery) {
    try {
      const defaulters = await DefaulterRepo.getDefaulters(req, query);

      const defaultUsers = await Defaulter.getDefaultUsers(defaulters);

      this.handleSuccess(req, res, defaultUsers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", canCreateDefaulters)
  async getDefaulter(@request() req: Request, @response() res: Response, @requestParam("id") _id: string) {
    try {
      const workspace = req.session.workspace;
      const defaulter = await DefaulterRepo.byQuery({ workspace, _id });

      this.handleSuccess(req, res, defaulter);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/:id", canCreateDefaulters)
  async deleteDefaulter(@request() req: Request, @response() res: Response, @requestParam("id") _id: string) {
    try {
      const workspace = req.session.workspace;
      const defaulter = await DefaulterRepo.byQuery({ workspace, _id });

      await DefaulterRepo.deleteDefaulter(defaulter);

      this.handleSuccess(req, res, null);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
