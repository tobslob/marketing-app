import { Schema, SchemaTypes } from "mongoose";
import { trimmedLowercaseString, trimmedString, readMapper, timestamps, uuid } from "../util";

export const EmailReportsSchema = new Schema(
  {
    _id: { ...uuid },
    email: { ...trimmedLowercaseString, required: true, index: true },
    timestamp: { type: SchemaTypes.Date, index: true },
    "smtp-id": { ...trimmedString, index: true },
    event: { ...trimmedString, index: true },
    category: { ...trimmedString, index: true },
    sg_event_id: { ...trimmedLowercaseString, index: true },
    sg_message_id: { ...trimmedLowercaseString, index: true },
    useragent: { ...trimmedLowercaseString, index: true },
    ip: { ...trimmedString, index: true },
    url: { ...trimmedString, index: true },
    asm_group_id: { ...trimmedString, index: true },
    response: { ...trimmedLowercaseString, index: true },
    reason: { ...trimmedLowercaseString, index: true },
    workspace: { ...trimmedString, required: true, index: true },
    campaign_id: { ...trimmedString, required: true, index: true }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
