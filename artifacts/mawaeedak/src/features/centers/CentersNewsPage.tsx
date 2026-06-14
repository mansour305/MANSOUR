import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Newspaper, Search, Loader2, Share2, Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGatewayNews } from "@/hooks/useGatewayData";

export default function CentersNewsPage() {
  // Phase 12H: gateway hook â€” ظٹظ‚ط±ط£ ظ…ظ† Supabase ط¹ظ†ط¯ mode=supabaseطŒ API ط¹ظ†ط¯ mode=api
  // ط§ظ„ظƒطھط§ط¨ط©: ظ„ط§ ظٹظˆط¬ط¯ mutations ظپظٹ ظ‡ط°ظ‡ ط§ظ„طµظپط­ط© (read-only)
  const { data: news, isLoading } = useGatewayNews();
  const [search, setSearch] = useState("");

  const filtered = (news ?? [])
    .filter(n => n.is_published)
    .filter(n => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        (n.category ?? "").toLowerCase().includes(q) ||
        (n.source ?? "").toLowerCase().includes(q)
      );
    });

  const handleShare = (item: { title: string }) => {
    const text = `${item.title}\n\nظ…ظˆط§ط¹ظٹط¯ظƒ â€” ظ…ظ†طµط© طھط¬ظ…ط¹ ظˆظ‚طھظƒ ظˆظ…ظˆط§ط¹ظٹط¯ظƒ`;
    if (navigator.share) {
      navigator.share({ title: item.title, text }).catch(() => null);
    } else {
      navigator.clipboard.writeText(text).then(() => {
        toast({ title: "طھظ… ط§ظ„ظ†ط³ط®", description: "طھظ… ظ†ط³ط® ط§ظ„ط®ط¨ط± ط¥ظ„ظ‰ ط§ظ„ط­ط§ظپط¸ط©" });
      });
    }
  };

  return (
    <AppShell title="ظ…ط±ظƒط² ط§ظ„ط£ط®ط¨ط§ط±" showBack>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ط¨ط­ط« ظپظٹ ط§ظ„ط£ط®ط¨ط§ط±..."
            className="pr-9 h-12 rounded-xl bg-card"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item) => (
              <Card key={item.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                      <Newspaper className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground leading-tight mb-1">{item.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <span className="bg-muted px-2 py-0.5 rounded text-[10px]">{item.category}</span>
                        {item.source && <span>{item.source}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-9 text-xs font-medium gap-1"
                      onClick={() => handleShare(item)}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      ظ…ط´ط§ط±ظƒط©
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-9 text-xs font-medium gap-1"
                      onClick={() => {
                        toast({ title: "طھظ… ط§ظ„ط­ظپط¸", description: `طھظ… ط­ظپط¸ "${item.title}"` });
                      }}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      ط­ظپط¸
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            ظ„ط§ طھظˆط¬ط¯ ظ†طھط§ط¦ط¬ ظ„ظ„ط¨ط­ط« ط¹ظ† "{search}"
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">ظ„ط§ طھظˆط¬ط¯ ط£ط®ط¨ط§ط± ط­ط§ظ„ظٹط§ظ‹</div>
        )}
      </div>
    </AppShell>
  );
}

