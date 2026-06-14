/**
 * Notification Scheduler Service â€” Phase 13C
 *
 * ظٹظˆظ„ط¯ ط¥ط´ط¹ط§ط±ط§طھ ط¯ط§ط®ظ„ظٹط© طھظ„ظ‚ط§ط¦ظٹط© ظ…ط¬ط¯ظˆظ„ط©:
 * - طھط°ظƒظٹط±ط§طھ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ (ظ„ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„طھظٹ طھط­طھط§ط¬ طھط°ظƒظٹط±)
 * - طھط°ظƒظٹط±ط§طھ ط§ظ„ط£ط­ط¯ط§ط« ط§ظ„ظ…ط§ظ„ظٹط©
 * - ط¥ط´ط¹ط§ط± ظ…ط­طھظˆظ‰ ط§ظ„ظٹظˆظ… (ظٹظˆظ…ظٹ)
 *
 * Idempotent: ظٹط³طھط®ط¯ظ… source_key ظ„ظ…ظ†ط¹ ط§ظ„طھظƒط±ط§ط±.
 * Timezone: Asia/Riyadh
 */

import { db } from "@workspace/db";
import {
  notificationsTable,
  appointmentsTable,
  financialEventsTable,
  automationLogsTable,
} from "@workspace/db";
import { eq, and, gte, lte, isNull, or } from "drizzle-orm";
import { logger } from "./logger";
import { getRiyadhDateString } from "./dailyContentService";

async function notificationExists(sourceKey: string): Promise<boolean> {
  const rows = await db
    .select({ id: notificationsTable.id })
    .from(notificationsTable)
    .where(eq(notificationsTable.source_key, sourceKey))
    .limit(1);
  return rows.length > 0;
}

async function createNotification(params: {
  title: string;
  body: string;
  type: string;
  source_key: string;
}): Promise<boolean> {
  const exists = await notificationExists(params.source_key);
  if (exists) return false;
  await db.insert(notificationsTable).values({
    title: params.title,
    body: params.body,
    type: params.type,
    is_read: false,
    source_key: params.source_key,
  });
  return true;
}

async function logAutomation(
  job_name: string,
  status: string,
  details: string,
  items_created: number,
): Promise<void> {
  try {
    await db.insert(automationLogsTable).values({
      job_name,
      status,
      details,
      items_created,
      run_at: getRiyadhDateString(),
    });
  } catch (e) {
    logger.warn({ err: e }, "[AutoLog] ظپط´ظ„ ط­ظپط¸ ط³ط¬ظ„ ط§ظ„ط£طھظ…طھط©");
  }
}

/**
 * scheduleAppointmentReminders
 * ظٹظڈظ†ط´ط¦ ط¥ط´ط¹ط§ط±ط§طھ طھط°ظƒظٹط± ظ„ظ„ظ…ظˆط§ط¹ظٹط¯ ظ„ظ„ظٹظˆظ… ط§ظ„ط­ط§ظ„ظٹ ظˆط؛ط¯.
 */
export async function scheduleAppointmentReminders(): Promise<number> {
  const today = getRiyadhDateString();
  const tomorrow = getRiyadhDateString(1);
  let created = 0;

  try {
    const appointments = await db
      .select()
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.reminder_enabled, true),
          or(
            eq(appointmentsTable.date, today),
            eq(appointmentsTable.date, tomorrow),
          ),
        ),
      );

    for (const appt of appointments) {
      const isToday = appt.date === today;
      const label = isToday ? "ط§ظ„ظٹظˆظ…" : "ط؛ط¯ط§ظ‹";
      const sourceKey = `appointment_reminder_${appt.id}_${appt.date}`;
      const ok = await createNotification({
        title: `طھط°ظƒظٹط± ظ…ظˆط¹ط¯ ${label}`,
        body: `ظ…ظˆط¹ط¯ "${appt.title}"${appt.time ? ` ط§ظ„ط³ط§ط¹ط© ${appt.time}` : ""} â€” ${label}`,
        type: "appointment",
        source_key: sourceKey,
      });
      if (ok) created++;
    }

    logger.info({ today, created }, "[NotifScheduler] طھط°ظƒظٹط±ط§طھ ط§ظ„ظ…ظˆط§ط¹ظٹط¯");
    await logAutomation("appointment_reminders", "success", `${today}: ${created} طھط°ظƒظٹط±`, created);
  } catch (err) {
    logger.error({ err }, "[NotifScheduler] ظپط´ظ„ طھط°ظƒظٹط±ط§طھ ط§ظ„ظ…ظˆط§ط¹ظٹط¯");
    await logAutomation("appointment_reminders", "failure", String(err), 0);
  }

  return created;
}

/**
 * scheduleFinancialReminders
 * ظٹظڈظ†ط´ط¦ ط¥ط´ط¹ط§ط±ط§طھ طھط°ظƒظٹط± ظ„ظ„ط£ط­ط¯ط§ط« ط§ظ„ظ…ط§ظ„ظٹط© ط§ظ„ظ‚ط§ط¯ظ…ط©.
 */
export async function scheduleFinancialReminders(): Promise<number> {
  const today = getRiyadhDateString();
  const in7days = getRiyadhDateString(7);
  let created = 0;

  try {
    const events = await db
      .select()
      .from(financialEventsTable)
      .where(
        and(
          eq(financialEventsTable.is_active, true),
          gte(financialEventsTable.next_date, today),
          lte(financialEventsTable.next_date, in7days),
        ),
      );

    for (const event of events) {
      const daysUntil = Math.round(
        (new Date(event.next_date).getTime() - new Date(today).getTime()) /
          86_400_000,
      );

      if (daysUntil > (event.reminder_days_before ?? 3)) continue;

      const label =
        daysUntil === 0 ? "ط§ظ„ظٹظˆظ…" : daysUntil === 1 ? "ط؛ط¯ط§ظ‹" : `ط®ظ„ط§ظ„ ${daysUntil} ط£ظٹط§ظ…`;
      const sourceKey = `financial_reminder_${event.id}_${event.next_date}`;

      const typeMap: Record<string, string> = {
        ط±ط§طھط¨: "salary",
        ط¯ط¹ظ…: "support",
        ظپط§طھظˆط±ط©: "bill",
        ظ‚ط±ط¶: "bill",
      };
      const notifType = typeMap[event.type] ?? "financial";

      const ok = await createNotification({
        title: `طھط°ظƒظٹط± ظ…ط§ظ„ظٹ â€” ${event.type}`,
        body: `"${event.name}" ظ…ظˆط¹ط¯ظ‡ ${label}${event.amount ? ` â€” ${Number(event.amount).toLocaleString("ar-SA")} ط±ظٹط§ظ„` : ""}`,
        type: notifType,
        source_key: sourceKey,
      });
      if (ok) created++;
    }

    logger.info({ today, created }, "[NotifScheduler] طھط°ظƒظٹط±ط§طھ ظ…ط§ظ„ظٹط©");
    await logAutomation("financial_reminders", "success", `${today}: ${created} طھط°ظƒظٹط±`, created);
  } catch (err) {
    logger.error({ err }, "[NotifScheduler] ظپط´ظ„ ط§ظ„طھط°ظƒظٹط±ط§طھ ط§ظ„ظ…ط§ظ„ظٹط©");
    await logAutomation("financial_reminders", "failure", String(err), 0);
  }

  return created;
}

/**
 * scheduleDailyContentNotification
 * ظٹظڈظ†ط´ط¦ ط¥ط´ط¹ط§ط± ظ…ط­طھظˆظ‰ ط§ظ„ظٹظˆظ… ط¥ط°ط§ ظ„ظ… ظٹظڈظ†ط´ط£ ظپط¹ظ„ط§ظ‹.
 */
export async function scheduleDailyContentNotification(
  messageText?: string,
): Promise<number> {
  const today = getRiyadhDateString();
  const sourceKey = `daily_content_${today}`;
  try {
    const ok = await createNotification({
      title: "ط±ط³ط§ظ„ط© ط§ظ„ظٹظˆظ…",
      body: messageText ?? "ط±ط³ط§ظ„طھظƒ ط§ظ„ظٹظˆظ…ظٹط© ط¬ط§ظ‡ط²ط© â€” طھظپط¶ظ‘ظ„ ط¨ط§ظ„ط§ط·ظ„ط§ط¹ ط¹ظ„ظٹظ‡ط§.",
      type: "daily_content",
      source_key: sourceKey,
    });
    if (ok) {
      logger.info({ today }, "[NotifScheduler] ط¥ط´ط¹ط§ط± ظ…ط­طھظˆظ‰ ط§ظ„ظٹظˆظ…");
      await logAutomation("daily_content_notification", "success", `ط¥ط´ط¹ط§ط± ${today}`, 1);
      return 1;
    }
    await logAutomation("daily_content_notification", "skipped", `ظ…ظˆط¬ظˆط¯ ${today}`, 0);
    return 0;
  } catch (err) {
    logger.error({ err }, "[NotifScheduler] ظپط´ظ„ ط¥ط´ط¹ط§ط± ظ…ط­طھظˆظ‰ ط§ظ„ظٹظˆظ…");
    await logAutomation("daily_content_notification", "failure", String(err), 0);
    return 0;
  }
}

/**
 * runAllScheduledJobs
 * طھط´ط؛ظٹظ„ ط¬ظ…ظٹط¹ ط§ظ„ظ…ظ‡ط§ظ… ط§ظ„ظ…ط¬ط¯ظˆظ„ط© ط¯ظپط¹ط© ظˆط§ط­ط¯ط©.
 */
export async function runAllScheduledJobs(): Promise<{
  appointmentReminders: number;
  financialReminders: number;
  dailyContentNotification: number;
}> {
  const [appointmentReminders, financialReminders, dailyContentNotification] =
    await Promise.all([
      scheduleAppointmentReminders(),
      scheduleFinancialReminders(),
      scheduleDailyContentNotification(),
    ]);
  return { appointmentReminders, financialReminders, dailyContentNotification };
}

