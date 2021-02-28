import { Model } from "@random-guys/bucket";

/**
 * Model of a Enterscale Workspace.
 */
export interface Workspace extends Model {
  name: string;
  address: string;
  email_address: string;
}

export interface WorkspaceDTO {
  name: string;
  address: string;
  workspace_email: string
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
}