import mongoose from "mongoose";
import { BaseRepository } from "@random-guys/bucket";
import { UrlShortner } from "./url-shortner.model";
import { UrlShortnerSchema } from "./url-shortner.schema";
import { mapConcurrently } from "../util";
import  { generate } from "shortid";

export class URLRepository extends BaseRepository<UrlShortner> {
  constructor() {
    super(mongoose.connection, "UrlShortner", UrlShortnerSchema);
  }

  async createShortUrl(urls: string[]) {
    return await mapConcurrently(urls, url => {
      return this.create({
        long_url: url,
        short_url: generate()
      });
    });
  }
}

export const UrlShortnerRepo = new URLRepository();
