import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { AuditLogSchema } from "./audit-log.schema";
import { AuditLog, AuditLogDTO } from "./audit-log.model";
import { UserRepo } from "../user";
import { Request } from "express";

export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor() {
    super(mongoose.connection, "AuditLog", AuditLogSchema);
  }

  async saveLog(req: Request, log: AuditLogDTO) {
    const ipAddr = req.headers["x-forwarded-for"] || req["connection"].remoteAddress;

    const user = await UserRepo.byID(req.session.user);
    return this.create({
      user_id: user.id,
      user_name: `${user.first_name} ${user.last_name}`,
      workspace: req.session.workspace,
      role_id: user.role_id,
      role_name: user.role_name,
      activity: log.activity,
      object_id: log.object_id,
      message: log.message,
      ip_address: ipAddr,
      channel: log.channel
    });
  }
}

export const AuditLogRepo = new AuditLogRepository();
