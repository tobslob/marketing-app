import * as queryString from "query-string";
import dotenv from "dotenv";
import { Axios } from "@app/data/util/proxy";
import { Campaign } from "@app/data/campaign";
import { User } from "@app/data/user";

dotenv.config();

export const customAudience = <const>["USER_PROVIDED_ONLY", "PARTNER_PROVIDED_ONLY", "BOTH_USER_AND_PARTNER_PROVIDED"];
export type CustomAudienceType = typeof customAudience[number];

class ProxyServices {
  async verifyBVN(bvn: string) {
    const data = Axios(`${process.env.flutter_url}`, "get", bvn, null, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.auth_scheme} ${process.env.sec_key}`
      }
    });

    return data;
  }

  stringifiedParams = queryString.stringify({
    client_id: process.env.fb_client_id,
    redirect_uri: `${process.env.fb_login_url}`,
    scope: ["email"].join(","),
    response_type: "code",
    auth_type: "rerequest",
    display: "popup"
  });

  facebookLoginUrl = `${process.env.fb_url}/dialog/oauth?${this.stringifiedParams}`;

  async getAccessTokenFromCode(code: string) {
    const data = await Axios(`${process.env.fb_url}/oauth/access_token`, "get", null, null, {
      client_id: process.env.fb_client_id,
      client_secret: process.env.fb_app_secret,
      redirect_uri: `${process.env.fb_login_url}`,
      code
    });

    return data;
  }

  async getFacebookUserData(access_token: string) {
    const { data } = await Axios(`${process.env.fb_graph_url}/me`, "get", null, null, {
      fields: ["id", "email", "first_name", "last_name"].join(","),
      access_token
    });

    return data;
  }

  async createCustomAudience(
    access_token: string,
    name: string,
    subtype: string,
    description: string,
    customer_file_source: CustomAudienceType
  ) {
    const data = await Axios(
      `${process.env.fb_graph_url}/v10.0/act_${process.env.fb_account_id}/customaudiences`,
      "post",
      null,
      {
        name,
        subtype,
        description,
        customer_file_source,
        access_token
      }
    );
    return data;
  }

  async sms(campaign: Campaign, user: User) {
    const data = await Axios(
      process.env.sms_url,
      "post",
      null,
      {
        username: process.env.sms_username,
        to: user.email_address,
        message: campaign.message,
        from: "Mooyi",
        bulkSMSMode: 1,
        enqueue: 1,
        retryDurationInHours: 2
      },
      null,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          apiKey: process.env.sms_api_key
        }
      }
    );

    return data;
  }
}

export const Proxy = new ProxyServices();