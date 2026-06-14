import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Gift } from "lucide-react";

interface GreetingType {
  id: string;
  label: string;
  emoji: string;
  templates: string[];
}

const GREETING_TYPES: GreetingType[] = [
  {
    id: "eid",
    label: "ط¹ظٹط¯",
    emoji: "ًںŒ™",
    templates: [
      "ظƒظ„ ط¹ط§ظ… ظˆط£ظ†طھظ… ط¨ط®ظٹط±طŒ طھظ‚ط¨ظ„ ط§ظ„ظ„ظ‡ ظ…ظ†ط§ ظˆظ…ظ†ظƒظ… طµط§ظ„ط­ ط§ظ„ط£ط¹ظ…ط§ظ„طŒ ط¹ظٹط¯ظƒظ… ظ…ط¨ط§ط±ظƒ ظˆط£ظٹط§ظ…ظƒظ… ط³ط¹ظٹط¯ط©.",
      "ط£ظ‡ظ†ط¦ظƒظ… ط¨ط­ظ„ظˆظ„ ط§ظ„ط¹ظٹط¯ ط§ظ„ط³ط¹ظٹط¯طŒ ط£ط¹ط§ط¯ظ‡ ط§ظ„ظ„ظ‡ ط¹ظ„ظٹظ†ط§ ظˆط¹ظ„ظٹظƒظ… ط¨ط§ظ„ظٹظ…ظ† ظˆط§ظ„ط¨ط±ظƒط§طھطŒ ظˆظƒظ„ ط¹ط§ظ… ظˆط£ظ†طھظ… ط¨ط£ظ„ظپ ط®ظٹط±.",
    ],
  },
  {
    id: "graduation",
    label: "طھط®ط±ط¬",
    emoji: "ًںژ“",
    templates: [
      "ط£ظ„ظپ ظ…ط¨ط±ظˆظƒ ط§ظ„طھط®ط±ط¬! ظˆظ…ظ†ظ‡ط§ ظ„ظ„ط£ط¹ظ„ظ‰ ظٹط§ ط±ط¨طŒ طھط¹ط¨طھ ظˆظ†ظ„طھ ظˆظ…ط§ طھط³طھط§ظ‡ظ„ ط؛ظٹط± ط§ظ„ط£ط­ط³ظ†.",
      "ظ…ط¨ط§ط±ظƒ ط§ظ„طھط®ط±ط¬طŒ ظ‡ط°ط§ ط£ظ‚ظ„ ظ…ط§ طھط³طھط­ظ‚ظ‡طŒ ظˆظپظ‚ظƒ ط§ظ„ظ„ظ‡ ظپظٹ ظ…ط³ظٹط±طھظƒ ظˆط¬ط¹ظ„ ط£ظ…ط§ظ…ظƒ ط§ظ„ط£ظپط¶ظ„ ط¯ط§ط¦ظ…ط§ظ‹.",
    ],
  },
  {
    id: "success",
    label: "ظ†ط¬ط§ط­",
    emoji: "ًںڈ†",
    templates: [
      "ط£ظ„ظپ ظ…ط¨ط±ظˆظƒ ط§ظ„ظ†ط¬ط§ط­! ظ…ط§ ط´ط§ط، ط§ظ„ظ„ظ‡ ط¹ظ„ظٹظƒطŒ ط«ظ…ط±ط© طھط¹ط¨ظƒ ظˆظ…ط¬ظ‡ظˆط¯ظƒ ط§ظ„ط¯ط¤ظˆط¨طŒ ط¥ظ„ظ‰ ط§ظ„ط£ظ…ط§ظ… ط¯ط§ط¦ظ…ط§ظ‹.",
      "ظ…ط¨ط§ط±ظƒ ظ†ط¬ط§ط­ظƒ ط§ظ„ظ…ط³طھط­ظ‚طŒ ظƒظ… ظ…ظ† ظ„ظٹظ„ط© ط³ظ‡ط±طھ ظˆظƒظ… ظ…ظ† طھط¹ط¨ طھط­ظ…ظ„طھطŒ ط§ظ„ظٹظˆظ… ط­ظ‚ ظ„ظƒ ط§ظ„ظپط®ط± ظˆط§ظ„ط³ط±ظˆط±.",
    ],
  },
  {
    id: "job",
    label: "ظˆط¸ظٹظپط©",
    emoji: "ًں’¼",
    templates: [
      "ط£ظ„ظپ ظ…ط¨ط±ظˆظƒ ط§ظ„ظˆط¸ظٹظپط© ط§ظ„ط¬ط¯ظٹط¯ط©! ظ†ط³ط£ظ„ ط§ظ„ظ„ظ‡ ظ„ظƒ ط§ظ„طھظˆظپظٹظ‚ ظˆط§ظ„ط³ط¯ط§ط¯ ظˆط£ظ† طھظƒظˆظ† ط¹ظˆظ†ط§ظ‹ ظ„ظƒ ط¹ظ„ظ‰ ط¨ط± ظˆط§ظ„ط¯ظٹظƒ.",
      "ظ…ط¨ط§ط±ظƒ ظ„ظƒ ط§ظ„ظ…ظ†طµط¨ ط§ظ„ط¬ط¯ظٹط¯طŒ ط£ظ†طھ ظ‚ط¯ظ‡ط§ ظˆطھط³طھط§ظ‡ظ„ ظƒظ„ ط®ظٹط±طŒ ظˆظ†ط³ط£ظ„ ط§ظ„ظ„ظ‡ ط£ظ† ظٹط¨ط§ط±ظƒ ظ„ظƒ ظپظٹ ط¹ظ…ظ„ظƒ.",
    ],
  },
  {
    id: "wedding",
    label: "ط²ظˆط§ط¬",
    emoji: "ًں’چ",
    templates: [
      "ط¨ط§ط±ظƒ ط§ظ„ظ„ظ‡ ظ„ظƒظ…ط§ ظˆط¨ط§ط±ظƒ ط¹ظ„ظٹظƒظ…ط§ ظˆط¬ظ…ط¹ ط¨ظٹظ†ظƒظ…ط§ ظپظٹ ط®ظٹط±. ط£ظ„ظپ ظ…ط¨ط±ظˆظƒ ظˆط¹ظ‚ط¨ط§ظ„ ط§ظ„ط¹ظ…ط± ظƒظ„ظ‡.",
      "ظ…ط¨ط§ط±ظƒ ط§ظ„ط²ظˆط§ط¬ ط§ظ„ظ…ظٹظ…ظˆظ† ط§ظ„ظ…ط¨ط§ط±ظƒطŒ ط¬ظ…ط¹ظƒظ… ط§ظ„ظ„ظ‡ ط¹ظ„ظ‰ ط§ظ„ط®ظٹط± ظˆط±ط²ظ‚ظƒظ… ط§ظ„ط³ط¹ط§ط¯ط© ظˆط§ظ„ظ…ظˆط¯ط© ظˆط§ظ„ط±ط­ظ…ط©.",
    ],
  },
  {
    id: "baby",
    label: "ظ…ظˆظ„ظˆط¯",
    emoji: "ًں‘¶",
    templates: [
      "ط¨ط§ط±ظƒ ط§ظ„ظ„ظ‡ ظ„ظƒ ظپظٹ ط§ظ„ظ…ظˆظ‡ظˆط¨طŒ ظˆط´ظƒط±طھ ط§ظ„ظˆط§ظ‡ط¨طŒ ظˆط¨ظ„ط؛ ط£ط´ط¯ظ‡طŒ ظˆط±ط²ظ‚طھ ط¨ط±ظ‡. ط£ظ„ظپ ظ…ط¨ط±ظˆظƒ ط§ظ„ظ…ظˆظ„ظˆط¯ ط§ظ„ط¬ط¯ظٹط¯.",
      "ظ…ط¨ط§ط±ظƒ ط§ظ„ظ…ظˆظ„ظˆط¯طŒ ط£ط³ط£ظ„ ط§ظ„ظ„ظ‡ ط£ظ† ظٹط¬ط¹ظ„ظ‡ ظ‚ط±ط© ط¹ظٹظ† ظ„ظˆط§ظ„ط¯ظٹظ‡ ظˆط£ظ† ظٹظƒظˆظ† ط°ط®ط±ط§ظ‹ ظ„ظ‡ظ… ظپظٹ ط§ظ„ط¯ظ†ظٹط§ ظˆط§ظ„ط¢ط®ط±ط©.",
    ],
  },
  {
    id: "national_day",
    label: "ط§ظ„ظٹظˆظ… ط§ظ„ظˆط·ظ†ظٹ",
    emoji: "ًں‡¸ًں‡¦",
    templates: [
      "ط¨ظ…ظ†ط§ط³ط¨ط© ط§ظ„ظٹظˆظ… ط§ظ„ظˆط·ظ†ظٹ ظ„ظ„ظ…ظ…ظ„ظƒط© ط§ظ„ط¹ط±ط¨ظٹط© ط§ظ„ط³ط¹ظˆط¯ظٹط©طŒ ظƒظ„ ط¹ط§ظ… ظˆط§ظ„ظˆط·ظ† ط¨ط®ظٹط± ظˆظ…ط¬ط¯طŒ ظˆظٹط²ط¯ط§ط¯ ظ‚ظˆط© ظˆط¹ط²ط©.",
      "ظپظٹ ط°ظƒط±ظ‰ ط§ظ„ظٹظˆظ… ط§ظ„ظˆط·ظ†ظٹ ط§ظ„ط¹ط²ظٹط²طŒ ط£ظ‡ظ†ط¦ظƒظ… ظˆط£ط³ط£ظ„ ط§ظ„ظ„ظ‡ ط£ظ† ظٹط­ظپط¸ ظ‡ط°ط§ ط§ظ„ظˆط·ظ† ط§ظ„ط؛ط§ظ„ظٹ ظˆظٹط¯ظٹظ… ط£ظ…ظ†ظ‡ ظˆط§ط²ط¯ظ‡ط§ط±ظ‡.",
    ],
  },
];

export default function CentersGreetingsPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<GreetingType>(GREETING_TYPES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(GREETING_TYPES[0].templates[0]);

  const handleTypeChange = (t: GreetingType) => {
    setSelectedType(t);
    setSelectedTemplate(t.templates[0]);
  };

  const previewText = `ط¹ط²ظٹط²ظٹ/ط¹ط²ظٹط²طھظٹ ${name || "[ط§ظ„ط§ط³ظ…]"}\n\n${selectedTemplate}\n\nظ…ط¹ ط£ط·ظٹط¨ ط§ظ„طھظ…ظ†ظٹط§طھ.`;

  const copyText = () => {
    navigator.clipboard.writeText(previewText).then(() => {
      toast({ title: "طھظ… ط§ظ„ظ†ط³ط®", description: "طھظ… ظ†ط³ط® ط§ظ„طھظ‡ظ†ط¦ط© ط¥ظ„ظ‰ ط§ظ„ط­ط§ظپط¸ط©" });
    }).catch(() => {
      toast({ title: "طھط¹ط°ظ‘ط± ط§ظ„ظ†ط³ط®", variant: "destructive" });
    });
  };

  const shareText = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: previewText });
      } catch {
        copyText();
      }
    } else {
      copyText();
    }
  };

  return (
    <AppShell title="ظ…ط±ظƒط² ط§ظ„طھظ‡ط§ظ†ظٹ" showBack>
      <div className="space-y-5 pb-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">ظ…ظˆظ„ظ‘ط¯ ط§ظ„طھظ‡ط§ظ†ظٹ</h2>
            <p className="text-sm text-muted-foreground">ط§ط®طھط± ط§ظ„ظ‚ط§ظ„ط¨ ظˆط´ط§ط±ظƒ ط§ظ„ظپط±ط­ط©</p>
          </div>
        </div>

        {/* Recipient Name */}
        <div className="space-y-2">
          <Label>ط§ظ„ظ…ط±ط³ظ„ ط¥ظ„ظٹظ‡</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="ط§ط³ظ… ط§ظ„ط´ط®طµ (ط§ط®طھظٹط§ط±ظٹ)"
            className="h-12 bg-card"
          />
        </div>

        {/* Greeting Type Selector */}
        <div className="space-y-2">
          <Label>ظ†ظˆط¹ ط§ظ„طھظ‡ظ†ط¦ط©</Label>
          <div className="grid grid-cols-4 gap-2">
            {GREETING_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => handleTypeChange(t)}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border text-center gap-1 transition-all ${
                  selectedType.id === t.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className={`text-[10px] font-bold ${selectedType.id === t.id ? "text-primary" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Template Selector */}
        <div className="space-y-2">
          <Label>ط§ط®طھط± ط§ظ„ظ‚ط§ظ„ط¨</Label>
          <div className="space-y-2">
            {selectedType.templates.map((t, i) => (
              <Card
                key={i}
                className={`cursor-pointer transition-all border-2 ${
                  selectedTemplate === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
                onClick={() => setSelectedTemplate(t)}
              >
                <CardContent className="p-4 text-sm leading-relaxed text-foreground">
                  {t}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview */}
        <Card className="border-border bg-card shadow-inner">
          <CardContent className="p-5">
            <div className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1">
              <span className="text-base">{selectedType.emoji}</span>
              ظ…ط¹ط§ظٹظ†ط© ط§ظ„طھظ‡ظ†ط¦ط©
            </div>
            <p className="whitespace-pre-wrap leading-loose text-sm font-medium text-foreground">
              {previewText}
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button className="flex-1 h-12 font-bold" onClick={shareText}>
            <Share2 className="w-4 h-4 ml-2" />
            ظ…ط´ط§ط±ظƒط©
          </Button>
          <Button variant="outline" className="flex-1 h-12 font-bold" onClick={copyText}>
            <Copy className="w-4 h-4 ml-2" />
            ظ†ط³ط®
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

