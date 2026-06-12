import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/mawaeedak-reference.css";
import "./styles/night-polish.css";
import { registerApiAuth } from "./lib/apiAuth";
import { registerPwaServiceWorker } from "./lib/pwaRegistration";
import { setupNotificationClickHandler } from "./lib/push/pushNotificationService";

function renderBootError(error: unknown): void {
  const rootElement = document.getElementById("root");
  const message = error instanceof Error ? error.message : String(error);

  console.error("[Mawaeedak] boot failure", error);

  if (!rootElement) return;

  rootElement.innerHTML = `
    <main dir="rtl" style="min-height:100dvh;display:flex;align-items:center;justify-content:center;background:#faf7f2;padding:24px;font-family:Tajawal,Arial,sans-serif;color:#3d2b1f;text-align:center">
      <section style="max-width:360px;width:100%;background:white;border:1px solid rgba(201,160,99,.35);border-radius:24px;padding:24px;box-shadow:0 18px 48px rgba(138,107,61,.14)">
        <h1 style="font-size:20px;margin:0 0 10px;font-weight:800">تعذر تشغيل مواعيدك</h1>
        <p style="font-size:14px;line-height:1.8;margin:0 0 18px;color:#7a5c3a">حدث خطأ أثناء تحميل التطبيق. تم منع الشاشة البيضاء وعرض هذه الرسالة لتسهيل التشخيص.</p>
        <pre style="white-space:pre-wrap;text-align:left;direction:ltr;background:#f7f1e8;border-radius:14px;padding:12px;font-size:12px;max-height:180px;overflow:auto;color:#5f4630">${message.replace(/[<>&]/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[ch] ?? ch))}</pre>
        <button onclick="location.reload()" style="margin-top:16px;width:100%;height:44px;border:0;border-radius:14px;background:#c9973d;color:white;font-weight:800;font-size:15px">إعادة التحميل</button>
      </section>
    </main>
  `;
}

try {
  registerApiAuth();
  registerPwaServiceWorker();
  setupNotificationClickHandler();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("#root element not found");
  }

  createRoot(rootElement).render(<App />);
} catch (error) {
  renderBootError(error);
}
