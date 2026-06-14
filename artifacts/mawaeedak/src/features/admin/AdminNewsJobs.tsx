/**
 * AdminNewsJobs â€” Phase 12L
 *
 * Read:   useGatewayNews / useGatewayJobs â†’ API (mode=api/shadow) | Supabase (mode=supabase)
 * Write:  gwCreate/Update/Delete News/Job
 *           mode=api/shadow â†’ POST/PATCH/DELETE /api/news | /api/jobs
 *           mode=supabase   â†’ Supabase INSERT/UPDATE/DELETE
 *           ظ„ط§ fallback طµط§ظ…طھ â€” ظƒظ„ ظپط´ظ„ ظٹظڈط¹ط±ط¶ toast ظˆط§ط¶ط­
 *
 * Invalidation ط¨ط¹ط¯ ظƒظ„ write:
 *   - gwQueryKeys.news / gwQueryKeys.jobs â†’ ظٹظڈط¹ظٹط¯ ط¬ظ„ط¨ Gateway cache
 *   - getListNewsQueryKey / getListJobsQueryKey â†’ Orval compat
 *
 * IDs:
 *   - news.id = integer ظ…ط¨ط§ط´ط± (row.id ظپظٹ Supabase = ظ†ظپط³ API id)
 *   - jobs.id = integer ظ…ط¨ط§ط´ط± (ظ†ظپط³ ط§ظ„ط£ظ…ط±)
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListNewsQueryKey,
  getListJobsQueryKey,
} from "@api-client";
import { Plus, Edit2, Trash2, Loader2, Newspaper, Briefcase } from "lucide-react";
import { useGatewayNews, useGatewayJobs, gwQueryKeys } from "@/hooks/useGatewayData";
import {
  gwCreateNews,
  gwUpdateNews,
  gwDeleteNews,
  gwCreateJob,
  gwUpdateJob,
  gwDeleteJob,
} from "@/lib/dataGateway";

export default function AdminNewsJobs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Phase 12L: Gateway read
  const { data: news, isLoading: newsLoading, refetch: refetchNews } = useGatewayNews();
  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useGatewayJobs();

  // Pending states for gateway mutations
  const [newsPending, setNewsPending] = useState(false);
  const [jobPending, setJobPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  // Dialogs
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<"news" | "job" | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // News Form
  const [newsTitle, setNewsTitle] = useState("");
  const [newsBody, setNewsBody] = useState("");
  const [newsCat, setNewsCat] = useState("ط¹ط§ظ…");
  const [newsSource, setNewsSource] = useState("");
  const [newsActive, setNewsActive] = useState(true);

  // Job Form
  const [jobTitle, setJobTitle] = useState("");
  const [jobEmployer, setJobEmployer] = useState("");
  const [jobSector, setJobSector] = useState("ط®ط§طµ");
  const [jobCity, setJobCity] = useState("ط§ظ„ط±ظٹط§ط¶");
  const [jobUrl, setJobUrl] = useState("");
  const [jobActive, setJobActive] = useState(true);

  // Invalidation ط¨ط¹ط¯ ظƒظ„ write
  const invalidateNews = () => {
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.news });
    queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
    void refetchNews();
  };
  const invalidateJobs = () => {
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.jobs });
    queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
    void refetchJobs();
  };

  const openNewsAdd = () => {
    setIsEdit(false); setEditId(null);
    setNewsTitle(""); setNewsBody(""); setNewsCat("ط¹ط§ظ…"); setNewsSource(""); setNewsActive(true);
    setIsNewsOpen(true);
  };

  const openNewsEdit = (item: { id: number; title: string; body?: string | null; category: string; source?: string | null; is_published: boolean }) => {
    setIsEdit(true); setEditId(item.id);
    setNewsTitle(item.title); setNewsBody(item.body ?? ""); setNewsCat(item.category);
    setNewsSource(item.source ?? ""); setNewsActive(item.is_published);
    setIsNewsOpen(true);
  };

  const openJobAdd = () => {
    setIsEdit(false); setEditId(null);
    setJobTitle(""); setJobEmployer(""); setJobSector("ط®ط§طµ"); setJobCity("ط§ظ„ط±ظٹط§ط¶");
    setJobUrl(""); setJobActive(true);
    setIsJobOpen(true);
  };

  const openJobEdit = (item: { id: number; title: string; employer: string; sector: string; city: string; apply_url?: string | null; is_active?: boolean }) => {
    setIsEdit(true); setEditId(item.id);
    setJobTitle(item.title); setJobEmployer(item.employer); setJobSector(item.sector);
    setJobCity(item.city); setJobUrl(item.apply_url ?? ""); setJobActive(item.is_active ?? true);
    setIsJobOpen(true);
  };

  const handleNewsSave = async () => {
    if (!newsTitle) return;
    const payload = {
      title: newsTitle,
      body: newsBody || undefined,
      category: newsCat,
      source: newsSource || undefined,
      is_published: newsActive,
    };
    setNewsPending(true);
    try {
      const result = isEdit && editId
        ? await gwUpdateNews(editId, payload)
        : await gwCreateNews(payload);
      if (result.success) {
        toast({ title: isEdit ? "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" : "طھظ…طھ ط§ظ„ط¥ط¶ط§ظپط©" });
        setIsNewsOpen(false);
        invalidateNews();
      } else {
        toast({ title: "ط®ط·ط£", description: result.error ?? "ظپط´ظ„طھ ط§ظ„ط¹ظ…ظ„ظٹط©", variant: "destructive" });
      }
    } finally {
      setNewsPending(false);
    }
  };

  const handleJobSave = async () => {
    if (!jobTitle || !jobEmployer) return;
    const payload = {
      title: jobTitle,
      employer: jobEmployer,
      sector: jobSector,
      city: jobCity,
      apply_url: jobUrl || undefined,
      is_active: jobActive,
    };
    setJobPending(true);
    try {
      const result = isEdit && editId
        ? await gwUpdateJob(editId, payload)
        : await gwCreateJob(payload);
      if (result.success) {
        toast({ title: isEdit ? "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" : "طھظ…طھ ط§ظ„ط¥ط¶ط§ظپط©" });
        setIsJobOpen(false);
        invalidateJobs();
      } else {
        toast({ title: "ط®ط·ط£", description: result.error ?? "ظپط´ظ„طھ ط§ظ„ط¹ظ…ظ„ظٹط©", variant: "destructive" });
      }
    } finally {
      setJobPending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;
    setDeletePending(true);
    try {
      const result = deleteType === "news"
        ? await gwDeleteNews(deleteId)
        : await gwDeleteJob(deleteId);
      if (result.success) {
        toast({ title: "طھظ… ط§ظ„ط­ط°ظپ" });
        setIsDeleteOpen(false);
        if (deleteType === "news") invalidateNews();
        else invalidateJobs();
      } else {
        toast({ title: "ط®ط·ط£ ظپظٹ ط§ظ„ط­ط°ظپ", description: result.error ?? "ظپط´ظ„ ط§ظ„ط­ط°ظپ", variant: "destructive" });
        setIsDeleteOpen(false);
      }
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(180deg, hsl(38 62% 52%), hsl(32 55% 42%))" }}
        />
        <h1 className="text-2xl font-extrabold" style={{ color: "hsl(22 62% 18%)" }}>
          ط§ظ„ط£ط®ط¨ط§ط± ظˆط§ظ„ظˆط¸ط§ط¦ظپ
        </h1>
      </div>

      <Tabs defaultValue="news" className="space-y-4">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="news">ط§ظ„ط£ط®ط¨ط§ط±</TabsTrigger>
          <TabsTrigger value="jobs">ط§ظ„ظˆط¸ط§ط¦ظپ</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openNewsAdd} size="sm"><Plus className="w-4 h-4 ml-1" /> ط¥ط¶ط§ظپط© ط®ط¨ط±</Button>
          </div>
          {newsLoading
            ? <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            : (news ?? []).map(item => (
              <Card key={item.id} className={`border-border ${!item.is_published ? "opacity-60" : ""}`}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-primary" /> {item.title}
                    </h4>
                    <div className="text-xs text-muted-foreground mt-1">{item.category} â€¢ {item.source}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openNewsEdit(item)}><Edit2 className="w-4 h-4 text-primary" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setDeleteType("news"); setDeleteId(item.id); setIsDeleteOpen(true); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openJobAdd} size="sm"><Plus className="w-4 h-4 ml-1" /> ط¥ط¶ط§ظپط© ظˆط¸ظٹظپط©</Button>
          </div>
          {jobsLoading
            ? <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            : (jobs ?? []).map(item => (
              <Card key={item.id} className={`border-border ${!item.is_active ? "opacity-60" : ""}`}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" /> {item.title}
                    </h4>
                    <div className="text-xs text-muted-foreground mt-1">{item.employer} â€¢ {item.city}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openJobEdit(item)}><Edit2 className="w-4 h-4 text-primary" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setDeleteType("job"); setDeleteId(item.id); setIsDeleteOpen(true); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* News Dialog */}
      <Dialog open={isNewsOpen} onOpenChange={setIsNewsOpen}>
        <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isEdit ? "طھط¹ط¯ظٹظ„ ط§ظ„ط®ط¨ط±" : "ط®ط¨ط± ط¬ط¯ظٹط¯"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>ط§ظ„ط¹ظ†ظˆط§ظ†</Label><Input value={newsTitle} onChange={e => setNewsTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>ط§ظ„طھظپط§طµظٹظ„</Label><Textarea value={newsBody} onChange={e => setNewsBody(e.target.value)} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>ط§ظ„طھطµظ†ظٹظپ</Label><Input value={newsCat} onChange={e => setNewsCat(e.target.value)} /></div>
              <div className="space-y-2"><Label>ط§ظ„ظ…طµط¯ط±</Label><Input value={newsSource} onChange={e => setNewsSource(e.target.value)} /></div>
            </div>
            <div className="flex items-center justify-between"><Label>ظ…ظ†ط´ظˆط±</Label><Switch checked={newsActive} onCheckedChange={setNewsActive} /></div>
            <Button className="w-full" onClick={handleNewsSave} disabled={newsPending}>
              {newsPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Dialog */}
      <Dialog open={isJobOpen} onOpenChange={setIsJobOpen}>
        <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isEdit ? "طھط¹ط¯ظٹظ„ ط§ظ„ظˆط¸ظٹظپط©" : "ظˆط¸ظٹظپط© ط¬ط¯ظٹط¯ط©"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>ط§ظ„ظ…ط³ظ…ظ‰ ط§ظ„ظˆط¸ظٹظپظٹ</Label><Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>ط¬ظ‡ط© ط§ظ„طھظˆط¸ظٹظپ</Label><Input value={jobEmployer} onChange={e => setJobEmployer(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>ط§ظ„ظ…ط¯ظٹظ†ط©</Label><Input value={jobCity} onChange={e => setJobCity(e.target.value)} /></div>
              <div className="space-y-2"><Label>ط§ظ„ظ‚ط·ط§ط¹</Label><Input value={jobSector} onChange={e => setJobSector(e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>ط±ط§ط¨ط· ط§ظ„طھظ‚ط¯ظٹظ…</Label><Input value={jobUrl} onChange={e => setJobUrl(e.target.value)} dir="ltr" /></div>
            <div className="flex items-center justify-between"><Label>ظ…طھط§ط­ط©</Label><Switch checked={jobActive} onCheckedChange={setJobActive} /></div>
            <Button className="w-full" onClick={handleJobSave} disabled={jobPending}>
              {jobPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="طھط£ظƒظٹط¯ ط§ظ„ط­ط°ظپ"
        description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯طں"
        onConfirm={handleDelete}
      />
    </div>
  );
}

