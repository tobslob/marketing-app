import "module-alias/register";
import "reflect-metadata";
import http from "http";
import { App } from "./server/app";
import dotenv from "dotenv";
import { rAmqp } from "./common/services/amqp";
import { Log } from "./common/services/logger";
import { Scheduler, job } from "./services/scheduler";

dotenv.config();

const start = async () => {
  try {
    const app = new App();
    const appServer = app.getServer().build();

    // connect to MongoDB
    await app.connectDB();
    Log.info("📦  MongoDB Connected!");

    // start running jobs
    await Scheduler.start();
    job()
    Log.info("🕕  Scheduler Job Started")

    // connect to amqp
    await rAmqp.init(process.env.amqp_url)
    Log.info("🐰  Amqp Connected!");

    // start server
    const httpServer = http.createServer(appServer);
    httpServer.listen(process.env.PORT);
    httpServer.on("listening", () => Log.info(`🚀  ${process.env.service_name} listening on ` + process.env.PORT));
  } catch (err) {
    Log.error(err, "Fatal server error");
  }
};

start();
