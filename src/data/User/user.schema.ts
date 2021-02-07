import { SchemaFactory } from "../database";
import { trimmedLowercaseString, trimmedString } from "../util/schema";
import { SchemaTypes } from "mongoose";

export const UserSchema = SchemaFactory({
  first_name: { ...trimmedString, required: true, index: true },
  last_name: { ...trimmedString, required: true, index: true },
  password: { ...trimmedString, default: null },
  email_address: { ...trimmedLowercaseString, required: true, index: true, unique: true },
  phone_number: { ...trimmedString, required: true, index: true },
  role_id: { ...trimmedString, required: true, index: true },
  role_name: { ...trimmedString, required: true, index: true },
  workspace: { ...trimmedString, required: true, index: true },
  permissions: { type: SchemaTypes.Mixed, requierd: true }
});