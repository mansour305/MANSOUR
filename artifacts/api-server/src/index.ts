import app from "./app";
import { logger } from "./lib/logger";
import cron from "node-cron";
import { generateDailyContent } from "./lib/dailyContentService";
import { runAllScheduledJobs } from "./lib/notificationSchedulerService";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // â”€â”€ Cron: Daily Content â€” 1:05 AM Asia/Riyadh â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  cron.schedule(
    "5 1 * * *",
    async () => {
      logger.info("[Cron] طھط´ط؛ظٹظ„ ظ…ظ‡ظ…ط© ط±ط³ط§ظ„ط© ط§ظ„ظٹظˆظ…");
      await generateDailyContent();
    },
    { timezone: "Asia/Riyadh" },
  );

  // â”€â”€ Cron: Scheduled Notifications â€” 7:00 AM Asia/Riyadh â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  cron.schedule(
    "0 7 * * *",
    async () => {
      logger.info("[Cron] طھط´ط؛ظٹظ„ ظ…ظ‡ظ…ط© ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ظ…ط¬ط¯ظˆظ„ط©");
      await runAllScheduledJobs();
    },
    { timezone: "Asia/Riyadh" },
  );

  logger.info("[Cron] ط§ظ„ظ…ظ‡ط§ظ… ط§ظ„ظ…ط¬ط¯ظˆظ„ط© ظ…ظپط¹ظ‘ظ„ط© (Asia/Riyadh)");
});

