import { BaseRepository, PaginationQuery } from "@random-guys/bucket";
import { Campaign, CampaignDTO } from "./campaign.model";
import mongoose from "mongoose";
import { CampaignSchema } from "./campaign.schema";
import { Workspace } from "../workspace";

class CampaignRepository extends BaseRepository<Campaign> {
  constructor() {
    super(mongoose.connection, "Campaign", CampaignSchema);
  }

  async createCampaign(workspace: Workspace, user: string, campaignDTO: CampaignDTO) {
    return this.create({
      name: campaignDTO.name,
      subject: campaignDTO.subject,
      description: campaignDTO.description,
      channel: campaignDTO.channel,
      amount: campaignDTO.amount,
      frequency: campaignDTO.frequency,
      start_date: campaignDTO.start_date,
      end_date: campaignDTO.end_date,
      target_audience: campaignDTO.target_audience,
      message: campaignDTO.message,
      user: user,
      workspace: workspace.id,
      workspace_name: workspace.name,
      status: "STOP",
      organisation: campaignDTO.organisation,
      subtype: campaignDTO.subtype,
      customer_file_source: campaignDTO.customer_file_source
    });
  }

  async editCampaign(workspace: string, id: string, campaignDTO: CampaignDTO) {
    return this.atomicUpdate(
      {
        _id: id,
        workspace
      },
      {
        $set: {
          name: campaignDTO.name,
          subject: campaignDTO.subject,
          description: campaignDTO.description,
          channel: campaignDTO.channel,
          amount: campaignDTO.amount,
          frequency: campaignDTO.frequency,
          start_date: campaignDTO.start_date,
          end_date: campaignDTO.end_date,
          target_audience: campaignDTO.target_audience,
          message: campaignDTO.message
        }
      }
    );
  }

  async getCampaigns(workspace: string, query: PaginationQuery) {
    return this.list({
      conditions: {
        workspace
      },
      sort: {
        created_at: -1
      },
      page: query.page,
      per_page: query.per_page
    });
  }

  async startCampaign(id: string) {
    return this.atomicUpdate(id, {
      $set: {
        status: "START",
        start_date: new Date()
      }
    });
  }

  async stopCampaign(id: string) {
    return this.atomicUpdate(id, {
      $set: {
        status: "STOP"
      }
    });
  }
}

export const CampaignRepo = new CampaignRepository();
