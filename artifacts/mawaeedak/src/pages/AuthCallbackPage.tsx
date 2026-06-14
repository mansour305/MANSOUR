import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Status = "loading" | "success" | "error" | "expired";

export default function AuthCallbackPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setStatus("error");
      setMessage("طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ط®ط¯ظ…ط© ط§ظ„ظ…طµط§ط¯ظ‚ط©");
      return;
    }

    const sb = supabase;
    const handleCallback = async () => {
      try {
        const { data, error } = await sb.auth.getSession();

        if (error) {
          if (
            error.message?.includes("expired") ||
            error.message?.includes("invalid")
          ) {
            setStatus("expired");
            setMessage(
              "ط±ط§ط¨ط· ط§ظ„طھط­ظ‚ظ‚ ط؛ظٹط± طµط§ظ„ط­ ط£ظˆ ظ…ظ†طھظ‡ظٹ ط§ظ„طµظ„ط§ط­ظٹط©. ط£ط¹ط¯ ط§ظ„طھط³ط¬ظٹظ„ ط£ظˆ ط§ط·ظ„ط¨ ط±ط§ط¨ط·ط§ظ‹ ط¬ط¯ظٹط¯ط§ظ‹."
            );
          } else {
            setStatus("error");
            setMessage("طھط¹ط°ط± ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط±ط§ط¨ط·. ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰.");
          }
          return;
        }

        if (data.session) {
          setStatus("success");
          setMessage("طھظ… ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط­ط³ط§ط¨ظƒ ط¨ظ†ط¬ط§ط­. ط¬ط§ط± ط§ظ„طھظˆط¬ظٹظ‡...");
          setTimeout(() => setLocation("/account"), 2000);
        } else {
          setStatus("expired");
          setMessage(
            "ط±ط§ط¨ط· ط§ظ„طھط­ظ‚ظ‚ ط؛ظٹط± طµط§ظ„ط­ ط£ظˆ ظ…ظ†طھظ‡ظٹ ط§ظ„طµظ„ط§ط­ظٹط©. ط£ط¹ط¯ ط§ظ„طھط³ط¬ظٹظ„ ط£ظˆ ط§ط·ظ„ط¨ ط±ط§ط¨ط·ط§ظ‹ ط¬ط¯ظٹط¯ط§ظ‹."
          );
        }
      } catch {
        setStatus("error");
        setMessage("ط­ط¯ط« ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹. ط­ط§ظˆظ„ ظ…ط±ط© ط£ط®ط±ظ‰.");
      }
    };

    handleCallback();
  }, [setLocation]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "hsl(var(--background))" }}
      dir="rtl"
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: "1px solid hsl(38 45% 72% / 0.4)" }}
      >
        <div
          className="px-6 py-5 text-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(22 55% 18%) 0%, hsl(28 50% 22%) 100%)",
          }}
        >
          <h1
            className="text-xl font-black tracking-wide"
            style={{ color: "hsl(38 72% 68%)" }}
          >
            ظ…ظˆط§ط¹ظٹط¯ظƒ
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(38 45% 55%)" }}>
            ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط­ط³ط§ط¨
          </p>
        </div>

        <div
          className="px-6 py-8 text-center space-y-4"
          style={{
            background:
              "linear-gradient(145deg, #FFFBF4 0%, hsl(36 28% 93%) 100%)",
          }}
        >
          {status === "loading" && (
            <>
              <Loader2
                className="w-10 h-10 animate-spin mx-auto"
                style={{ color: "hsl(38 72% 52%)" }}
              />
              <p className="text-sm" style={{ color: "hsl(22 30% 45%)" }}>
                ط¬ط§ط± ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط±ط§ط¨ط·...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2
                className="w-10 h-10 mx-auto"
                style={{ color: "hsl(130 40% 40%)" }}
              />
              <p
                className="text-sm font-semibold"
                style={{ color: "hsl(130 40% 35%)" }}
              >
                {message}
              </p>
            </>
          )}

          {(status === "error" || status === "expired") && (
            <>
              <XCircle
                className="w-10 h-10 mx-auto"
                style={{ color: "hsl(10 50% 45%)" }}
              />
              <p
                className="text-sm font-semibold"
                style={{ color: "hsl(10 50% 42%)" }}
              >
                {message}
              </p>
              <button
                onClick={() => setLocation("/")}
                className="mt-2 px-5 py-2 rounded-xl text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(38 72% 52%) 0%, hsl(32 68% 42%) 100%)",
                  color: "#fff",
                }}
              >
                ط§ظ„ط¹ظˆط¯ط© ظ„ظ„ط±ط¦ظٹط³ظٹط©
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

