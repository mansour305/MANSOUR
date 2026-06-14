import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import DailyCardPreview from "./DailyCardPreview";
import { useStore } from "@/hooks/useStore";
import { formatHijriDate, formatGregorianDate, getDayName } from "@/lib/utils";
import { Copy, Share2, Download } from "lucide-react";
import { showTopNotification } from "@/components/layout/TopNotificationBanner";
import { getRiyadhTodayKey } from "@/lib/riyadhTime";

// Saudi-based daily messages pool
const DAILY_MESSAGES = [
  "ظٹط¨ط¯ط£ ظٹظˆظ…ظƒ ط¨ظ†ظٹط© ط·ظٹط¨ط©طŒ ظˆطھظˆظƒظ‘ظ„ ط¹ظ„ظ‰ ط§ظ„ظ„ظ‡ ظپظٹ ظƒظ„ ط®ط·ظˆط©.",
  "ط­ط§ظپط¸ ط¹ظ„ظ‰ طµظ„ط§طھظƒ ظپظٹ ظˆظ‚طھظ‡ط§طŒ ظپظ‡ظٹ ظ†ظˆط± ظ„ظƒ ظپظٹ ط§ظ„ط¯ظ†ظٹط§ ظˆط§ظ„ط¢ط®ط±ط©.",
  "ط§ط¨ط¯ط£ ظٹظˆظ…ظƒ ط¨ط§ظ„طµظ„ط§ط© ط«ظ… ط§ظ„ط°ظ‡ط§ط¨ ط¥ظ„ظ‰ ط¹ظ…ظ„ظƒ ط¨ظ†ط´ط§ط·.",
  "ط§ظ„ظˆط±ط¯ ظˆط§ظ„طµط¨ط§ط­ ط§ظ„ط¬ظ…ظٹظ„ ظٹط¨ط¯ط£ط§ظ† ظ…ظ† ط§ظ„ظ‚ظ„ط¨.",
  "ظ„ط§ طھط¤ط¬ظ„ ط¹ظ…ظ„ ط§ظ„ظٹظˆظ… ط¥ظ„ظ‰ ط§ظ„ط؛ط¯طŒ ظپظƒظ„ ظٹظˆظ… ظ„ظ‡ ظپط±طµطھظ‡.",
  "ط£ط­ط³ظ† ط§ظ„ط¸ظ† ط¨ط§ظ„ظ„ظ‡طŒ ظˆط§ظپط¹ظ„ ظ…ط§ ط¨ظˆط³ط¹ظƒطŒ ظˆطھظˆظƒظ‘ظ„ ط¹ظ„ظ‰ ط§ظ„ظ„ظ‡.",
  "ظ…ظ‡ظ…ط§ ظƒط§ظ†طھ ط§ظ„طھط­ط¯ظٹط§طھطŒ ط«ظ‚ ط£ظ† ط§ظ„ظپط±ط¬ ظ‚ط±ظٹط¨.",
  "ط§ط¬ط¹ظ„ ظ„ظƒ ظ‡ط¯ظپط§ظ‹ ظƒظ„ ظٹظˆظ…طŒ ظˆط­ظ‚ظ‚ظ‡ ظ‚ط¨ظ„ ظ…ظ†طھطµظپ ط§ظ„ظ†ظ‡ط§ط±.",
  "ط§ظ„طھظپط§ط¤ظ„ ظٹط؛ظٹط± ط§ظ„ط­ظٹط§ط©طŒ ظپط§ط¨ط¯ط£ ظٹظˆظ…ظƒ ط¨ط§ط¨طھط³ط§ظ…ط©.",
  "ط°ظƒط± ط§ظ„ظ„ظ‡ ظ†ط¹ظ…ط©طŒ ظپط§ط­ظ…ط¯ظ‡ ط¹ظ„ظ‰ ظ†ط¹ظ…ط§ط¦ظ‡.",
  "ط§ظ„ط¹ظ…ظ„ ط¹ط¨ط§ط¯ط©طŒ ظپط£طھظ‚ظ† ظ…ط§ ط¨ظٹط¯ظƒ.",
  "ظ„ط§ طھط³طھط¹ط¬ظ„ ط§ظ„ظ†طھط§ط¦ط¬طŒ ظپط§ظ„ط£ط¬ظˆط± طھط£طھظٹ.",
  "ظƒظ† ط¨ط§ط±ط§ظ‹ ط¨ظˆط§ظ„ط¯ظٹظƒطŒ ظپط§ظ„ط¯ط¹ط§ط، ظ…ط³طھط¬ط§ط¨.",
  "ط§ظ„طھظˆط§ط²ظ† ط¨ظٹظ† ط§ظ„ط¹ظ…ظ„ ظˆط§ظ„ط¹ط¨ط§ط¯ط© ظ…ظپطھط§ط­ ط§ظ„ط³ط¹ط§ط¯ط©.",
  "ظƒظ„ ظٹظˆظ… ط¬ط¯ظٹط¯ ظ‡ظˆ ظپط±طµط© ط¬ط¯ظٹط¯ط© ظ„ظ„طھط؛ظٹظٹط±.",
  "ط§ظ„طµظ„ط§ط© ط¹ظ„ظ‰ ط§ظ„ظ†ط¨ظٹ ط­ظٹط§ط© ظ„ظ„ظ‚ظ„ط¨.",
  "ط§ظ„ط¹ظ…ظ„ ط§ظ„طµط§ظ„ط­ ظ„ط§ ظٹط¶ظٹط¹ ط£ط¨ط¯ط§ظ‹.",
  "طھظˆظƒظ„ ط¹ظ„ظ‰ ط§ظ„ظ„ظ‡ ظپظٹ ظƒظ„ ط£ظ…ط±طŒ ظپظ‡ظˆ ط®ظٹط± ظ…ط¹ظٹظ†.",
  "ط§ط²ط±ط¹ ط®ظٹط±ط§ظ‹ ط­ظٹط«ظ…ط§ ط­ظ„ظ„طھطŒ طھط­طµط¯ ط®ظٹط±ط§ظ‹ ط­ظٹط«ظ…ط§ ظƒظ†طھ.",
  "ط§ط¨ط¯ط£ ظٹظˆظ…ظƒ ط¨ط§ظ„طµظ„ط§ط©طŒ ظˆط§ط®طھظ… ظٹظˆظ…ظƒ ط¨ط§ظ„ط§ط³طھط؛ظپط§ط±.",
  "ط§ظ„ظپط±ط¬ ظ‚ط±ظٹط¨طŒ ظپظ„ط§ طھظٹط£ط³.",
  "ط§ط²ط±ط¹ن¼کè‰¯ه“په¾·ï¼Œو”¶èژ·ç¾ژه¥½ن؛؛ç”ںم€‚",
  "ط§ط¨ط¯ط£ ط¨ط§ظ„طھظˆظƒظ„ ط¹ظ„ظ‰ ط§ظ„ظ„ظ‡ طھظ†ط¬ط­.",
  "ط£ط­ط³ظ† ط¥ظ„ظ‰ ط§ظ„ظ†ط§ط³ طھط³طھط¹ط¨ط¯ ظ‚ظ„ظˆط¨ظ‡ظ….",
];

// Get today's message based on Saudi date
function getTodayMessage(): string {
  const saudiDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" });
  const today = new Date(saudiDate);
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_MESSAGES.length;
  return DAILY_MESSAGES[index];
}

export default function DailyCardPage() {
  const { user } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const message = useMemo(() => getTodayMessage(), []);

  // Generate text for copy
  const generateText = () => {
    const saudiHour = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" })).getHours();
    const greeting = saudiHour < 12 ? "طµط¨ط§ط­ ط§ظ„ط®ظٹط±" : "ظ…ط³ط§ط، ط§ظ„ط®ظٹط±";

    const lines = [
      "âœ¦ ظ…ظˆط§ط¹ظٹط¯ظƒ âœ¦",
      getDayName(),
      `${formatHijriDate()} ظ‡ظ€`,
      `${formatGregorianDate()} ظ…`,
      "",
      greeting,
      message,
      "",
      "ظˆط§ط°ظƒط±ظˆط§ ط§ظ„ظ„ظ‡ ط°ظƒط±ط§ظ‹ ظƒط«ظٹط±ط§ظ‹",
      "",
      "â”پâ”پâ”پâ”پâ”پâ”پâ”پâ”پâ”پâ”پâ”پâ”پâ”پâ”پ",
      "ظ…ظˆط§ط¹ظٹط¯ظƒ â€” ظ…ظ†طµط© طھط¬ظ…ط¹ ظˆظ‚طھظƒطŒ ط±ط§طھط¨ظƒطŒ ط¯ط¹ظ…ظƒطŒ ظˆط£ظ‡ظ… ظ…ظˆط§ط¹ظٹط¯ظƒ",
    ];

    return lines.join("\n");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateText());
      showTopNotification("طھظ… ظ†ط³ط® ط§ظ„ط¨ط·ط§ظ‚ط© ط¨ظ†ط¬ط§ط­", "success");
    } catch {
      showTopNotification("ظپط´ظ„ ظ†ط³ط® ط§ظ„ط¨ط·ط§ظ‚ط©", "error");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "ط¨ط·ط§ظ‚ط© ظٹظˆظ…ظٹط© - ظ…ظˆط§ط¹ظٹط¯ظƒ",
          text: generateText(),
          url: window.location.origin,
        });
        showTopNotification("طھظ…طھ ط§ظ„ظ…ط´ط§ط±ظƒط© ط¨ظ†ط¬ط§ط­", "success");
      } else {
        await navigator.clipboard.writeText(generateText());
        showTopNotification("طھظ… ظ†ط³ط® ط§ظ„ط¨ط·ط§ظ‚ط© ظ„ظ„ظ…ط´ط§ط±ظƒط©", "info");
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        showTopNotification("ظپط´ظ„ ط§ظ„ظ…ط´ط§ط±ظƒط©", "error");
      }
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    
    showTopNotification("ط¬ط§ط±ظٹ ط­ظپط¸ ط§ظ„طµظˆط±ط©...", "info");
    
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#FDF9F3",
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `mawaeedak-card-${getRiyadhTodayKey()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      showTopNotification("طھظ… ط­ظپط¸ ط§ظ„طµظˆط±ط© ط¨ظ†ط¬ط§ط­", "success");
    } catch (err) {
      console.error("[DailyCard] Save image error:", err);
      showTopNotification("ظپط´ظ„ ط­ظپط¸ ط§ظ„طµظˆط±ط©", "error");
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start pt-6 pb-8 px-4"
      style={{ background: "linear-gradient(180deg, #FDF9F3 0%, #F3E8D6 100%)" }}
    >
      {/* Card preview - ref for html2canvas */}
      <div ref={cardRef}>
        <DailyCardPreview message={message} />
      </div>
      
      {/* Action buttons only */}
      <div className="flex gap-3 mt-6 w-full max-w-[360px]">
        <Button 
          className="flex-1 h-12 rounded-xl text-sm font-bold"
          style={{ background: "#C9A063", color: "#FFFFFF" }}
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4 ml-1" />
          ظ†ط³ط®
        </Button>
        <Button 
          variant="outline"
          className="flex-1 h-12 rounded-xl text-sm font-bold"
          style={{ borderColor: "rgba(201,160,99,0.4)", color: "#8A6B3D" }}
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 ml-1" />
          ظ…ط´ط§ط±ظƒط©
        </Button>
        <Button 
          variant="outline"
          className="flex-1 h-12 rounded-xl text-sm font-bold"
          style={{ borderColor: "rgba(201,160,99,0.4)", color: "#8A6B3D" }}
          onClick={handleSaveImage}
        >
          <Download className="w-4 h-4 ml-1" />
          طµظˆط±ط©
        </Button>
      </div>
    </div>
  );
}

