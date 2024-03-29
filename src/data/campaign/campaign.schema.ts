import { trimmedString, readMapper, timestamps } from "@random-guys/bucket";
import { SchemaTypes, Schema } from "mongoose";
import { uuid } from "@app/data/util";

export const CampaignSchema = new Schema(
  {
    _id: { ...uuid },
    name: { ...trimmedString, required: true, index: true, unique: true },
    subject: { ...trimmedString, index: true },
    description: { ...trimmedString, index: true },
    channel: { ...trimmedString, required: true, index: true },
    frequency: { ...trimmedString, index: true },
    start_date: { type: SchemaTypes.Date, index: true },
    end_date: { type: SchemaTypes.Date, index: true },
    target_audience: { type: SchemaTypes.Array, index: true },
    message: { ...trimmedString, index: true },
    user: { ...trimmedString, required: true, index: true },
    workspace: { ...trimmedString, index: true },
    workspace_name: { ...trimmedString, index: true },
    status: { ...trimmedString, index: true, default: "STOP" },
    sent: { type: SchemaTypes.Boolean, index: true, default: false },
    subtype: { ...trimmedString, index: true },
    customer_file_source: { ...trimmedString, index: true },
    short_link: { type: SchemaTypes.Boolean, index: true, default: false },
    campaign_type: { ...trimmedString, index: true },
    gender: { type: SchemaTypes.Array, index: true },
    age: { type: SchemaTypes.Mixed, index: true },
    percentage_to_send_to: { type: SchemaTypes.Number, index: true },
    template_identifier: { ...trimmedString, index: true },
    delivery_time: { type: SchemaTypes.Array, index: true },
    schedule: { type: SchemaTypes.Boolean, index: true, default: false },
    location: { ...trimmedString, index: true },
    sent_date: { type: SchemaTypes.Date, index: true },
    video_url: { ...trimmedString, index: true },
    brand_logo: { ...trimmedString, index: true },
    hero_image: { ...trimmedString, index: true },
    audio_url: { ...trimmedString, index: true },
    state: { ...trimmedString, index: true, default: "CREATED" }
  },
  {
    ...readMapper,
    ...timestamps,
    selectPopulatedPaths: false
  }
);
