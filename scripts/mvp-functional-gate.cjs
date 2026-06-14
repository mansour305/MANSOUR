#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
let failures = 0;

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`Missing file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`❌ ${message}`);
}

function assertIncludes(file, content, needle, message) {
  if (content.includes(needle)) {
    pass(`${file}: ${message}`);
  } else {
    fail(`${file}: ${message} — missing ${JSON.stringify(needle)}`);
  }
}

function assertRegex(file, content, regex, message) {
  if (regex.test(content)) {
    pass(`${file}: ${message}`);
  } else {
    fail(`${file}: ${message} — missing pattern ${regex}`);
  }
}

function assertNotRegex(file, content, regex, message) {
  if (!regex.test(content)) {
    pass(`${file}: ${message}`);
  } else {
    fail(`${file}: ${message} — forbidden pattern ${regex}`);
  }
}

const files = {
  app: "artifacts/mawaeedak/src/App.tsx",
  bottomNav: "artifacts/mawaeedak/src/components/layout/BottomNav.tsx",
  topBar: "artifacts/mawaeedak/src/components/layout/TopBar.tsx",
  appShell: "artifacts/mawaeedak/src/components/layout/AppShell.tsx",
  centers: "artifacts/mawaeedak/src/features/centers/CentersPage.tsx",
  goals: "artifacts/mawaeedak/src/features/services/GoalsPage.tsx",
  costs: "artifacts/mawaeedak/src/features/services/CostsPage.tsx",
  reminders: "artifacts/mawaeedak/src/features/services/RemindersPage.tsx",
  finance: "artifacts/mawaeedak/src/features/finance/FinancePage.tsx",
  calendar: "artifacts/mawaeedak/src/features/calendar/CalendarPage.tsx",
  home: "artifacts/mawaeedak/src/features/home/HomePage.tsx",
  notifications: "artifacts/mawaeedak/src/features/notifications/NotificationsPage.tsx",
  more: "artifacts/mawaeedak/src/pages/MorePage.tsx",
  aladhanService: "artifacts/mawaeedak/src/lib/aladhanService.ts",
  prayerEngine: "artifacts/mawaeedak/src/hooks/usePrayerEngine.ts",
};

const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));

console.log("\nMawaeedak MVP Functional Gate\n");

// Locked MVP routes.
assertIncludes(files.app, source.app, "path=\"/calendar\"", "calendar route is registered");
assertRegex(files.app, source.app, /path=["']\/(finance|salaries)["']/, "finance or salaries route is registered");
assertIncludes(files.app, source.app, "path=\"/services\"", "services route is registered");
assertIncludes(files.app, source.app, "path=\"/notifications\"", "notifications route is registered");
assertIncludes(files.app, source.app, "path=\"/more\"", "more route is registered");
assertIncludes(files.app, source.app, "path=\"/services/goals\"", "goals service route is registered");
assertIncludes(files.app, source.app, "path=\"/services/costs\"", "costs service route is registered");
assertIncludes(files.app, source.app, "path=\"/services/reminders\"", "reminders service route is registered");

// Bottom navigation contract.
assertIncludes(files.bottomNav, source.bottomNav, "/calendar", "bottom nav contains calendar");
assertRegex(files.bottomNav, source.bottomNav, /\/(finance|salaries)/, "bottom nav contains salaries or finance");
assertRegex(files.bottomNav, source.bottomNav, /href:\s*["']\/["']|to=["']\/["']|\/\*\s*الرئيسية|الرئيسية/, "bottom nav contains home");
assertIncludes(files.bottomNav, source.bottomNav, "/services", "bottom nav contains services");
assertIncludes(files.bottomNav, source.bottomNav, "/more", "bottom nav contains more");
assertIncludes(files.bottomNav, source.bottomNav, "خدماتك", "bottom nav uses final label خدماتك");

// RTL shell contract.
assertRegex(files.appShell, source.appShell, /dir=["']rtl["']|dir=\{["']rtl["']\}/, "AppShell enforces RTL");
assertRegex(files.topBar, source.topBar, /dir=["']rtl["']|dir=\{["']rtl["']\}|خدماتك/, "TopBar is RTL-aware or uses final services label");
assertRegex(files.bottomNav, source.bottomNav, /dir=["']rtl["']|dir=\{["']rtl["']\}|خدماتك/, "BottomNav is RTL-aware or uses final services label");

// Services links contract.
assertRegex(files.centers, source.centers, /احسب هدفك[\s\S]*\/services\/goals|\/services\/goals[\s\S]*احسب هدفك/, "goals card links to /services/goals");
assertRegex(files.centers, source.centers, /حساب التكاليف[\s\S]*\/services\/costs|\/services\/costs[\s\S]*حساب التكاليف/, "costs card links to /services/costs");
assertRegex(files.centers, source.centers, /ذكرني[\s\S]*\/services\/reminders|\/services\/reminders[\s\S]*ذكرني/, "reminders card links to /services/reminders");
assertNotRegex(files.centers, source.centers, /احسب هدفك[\s\S]{0,160}\/centers\/work|حساب التكاليف[\s\S]{0,160}\/centers\/work|ذكرني[\s\S]{0,160}\/centers\/work/, "core service cards do not point to /centers/work");

// Goals functional contract.
assertRegex(files.goals, source.goals, /handleAdd|add\(/, "goal add handler exists");
assertRegex(files.goals, source.goals, /handleEdit|update\(/, "goal edit handler exists");
assertRegex(files.goals, source.goals, /handleDelete|deleteGoal/, "goal delete handler exists");
assertRegex(files.goals, source.goals, /complete\(|handleComplete/, "goal completion handler exists");
assertRegex(files.goals, source.goals, /currentProgress|targetAmount|progressPercent/, "goal progress calculation exists");
assertRegex(files.goals, source.goals, /localStorage|useGoalsGateway|Supabase|isSynced/, "goal persistence path exists");
assertRegex(files.goals, source.goals, /إضافة هدف|حفظ الهدف|تحديث الهدف|حذف الهدف/, "goal Arabic UX actions exist");

// Costs functional contract.
assertRegex(files.costs, source.costs, /handleAddProject/, "cost project add handler exists");
assertRegex(files.costs, source.costs, /handleEditProject/, "cost project edit handler exists");
assertRegex(files.costs, source.costs, /handleDeleteProject/, "cost project delete handler exists");
assertRegex(files.costs, source.costs, /handleAddItem/, "cost item add handler exists");
assertRegex(files.costs, source.costs, /handleEditItem/, "cost item edit handler exists");
assertRegex(files.costs, source.costs, /handleDeleteItem/, "cost item delete handler exists");
assertRegex(files.costs, source.costs, /computeProjectTotals|totalRemaining|remainingAmount/, "cost totals and remaining calculations exist");
assertRegex(files.costs, source.costs, /localStorage|saveProjects|loadProjects/, "cost local persistence exists");
assertRegex(files.costs, source.costs, /إضافة مشروع|إضافة البند|تم تحديث|تم حذف/, "cost Arabic UX actions exist");

// Reminders functional contract.
assertRegex(files.reminders, source.reminders, /handleAdd/, "reminder add handler exists");
assertRegex(files.reminders, source.reminders, /handleEdit/, "reminder edit handler exists");
assertRegex(files.reminders, source.reminders, /handleDelete/, "reminder delete handler exists");
assertRegex(files.reminders, source.reminders, /isReminderPast|activeReminders|pastReminders/, "reminder active/past classification exists");
assertRegex(files.reminders, source.reminders, /localStorage|saveReminders|loadReminders/, "reminder local persistence exists");
assertRegex(files.reminders, source.reminders, /إضافة تذكير|حفظ التذكير|تحديث التذكير|حذف التذكير/, "reminder Arabic UX actions exist");

// Core MVP screens are present and user-facing.
assertRegex(files.home, source.home, /مواقيت الصلاة|الصلاة|الرئيسية|مواعيدك/, "home page contains MVP daily content");
assertRegex(files.finance, source.finance, /الرواتب|الدعم|راتب|صرف/, "finance page contains salary/support content");
assertRegex(files.calendar, source.calendar, /التقويم|Calendar|calendar|موعد|event/i, "calendar page contains calendar content");
assertRegex(files.notifications, source.notifications, /الإشعارات|تنبيه|notification/i, "notifications page contains notification content");
assertRegex(files.more, source.more, /الخصوصية|الدعم|الشروط|الإعدادات|المزيد/, "more page contains settings/legal/support content");

// Prayer engine contract.
assertRegex(files.aladhanService, source.aladhanService, /Aladhan|timings|prayer|Fajr|Dhuhr|Asr|Maghrib|Isha/i, "Aladhan service exposes prayer timing logic");
assertRegex(files.prayerEngine, source.prayerEngine, /nextPrayer|prayer|countdown|usePrayer/i, "prayer engine exposes next prayer/countdown logic");

if (failures > 0) {
  console.error(`\nMVP Functional Gate failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log("\nMVP Functional Gate passed. Functional source contracts are present.\n");
