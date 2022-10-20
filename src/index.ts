import { DiscordClient } from "./structures/discord-client";
import { Logger } from "./utils/logger";

export const client = new DiscordClient({
  intents: 32767,
});
client.start();

process.on("unhandledRejection", (reason, promise) => {
  Logger.error(
    `\n\n========================================= Unhandled Rejection Error ========================================`
  );
  Logger.error(reason);
  Logger.error(
    `============================================================================================================\n\n`
  );
});

process.on("uncaughtException", (error, origin) => {
  Logger.error(
    `\n\n========================================= Uncaught Exception Error =========================================`
  );
  Logger.error(error);
  Logger.error(origin);
  Logger.error(
    `============================================================================================================\n\n`
  );
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
  Logger.error(
    `\n\n========================================= Uncaught Exception Error =========================================`
  );
  Logger.error(error);
  Logger.error(origin);
  Logger.error(
    `============================================================================================================\n\n`
  );
});