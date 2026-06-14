import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2, Users as UsersIcon, Ban, CheckCircle, MoreHorizontal } from "lucide-react";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  role: string;
  status: "active" | "banned" | "pending";
  created_at: string;
}

const ROLES = [
  { value: "user", label: "ظ…ط³طھط®ط¯ظ…" },
  { value: "admin", label: "ظ…ط¯ظٹط±" },
  { value: "super_admin", label: "ظ…ط¯ظٹط± ظ†ط¸ط§ظ…" },
  { value: "owner", label: "ظ…ط§ظ„ظƒ" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "ظ†ط´ط·", color: "bg-emerald-500/10 text-emerald-600" },
  { value: "banned", label: "ظ…ط­ط¸ظˆط±", color: "bg-red-500/10 text-red-600" },
  { value: "pending", label: "ظ‚ظٹط¯ ط§ظ„ط§ظ†طھط¸ط§ط±", color: "bg-amber-500/10 text-amber-600" },
];

const MEMBER_ADMIN_ENDPOINT_REQUIRED = "ط¥ط¯ط§ط±ط© ط§ظ„ط£ط¯ظˆط§ط± ظˆط§ظ„ط­ط¸ط± طھطھط·ظ„ط¨ endpoint ط¥ط¯ط§ط±ظٹ server-side ظˆظ„ط§ طھظڈظ†ظپظ‘ط° ظ…ظ† ط§ظ„ظ…طھطµظپط­.";

export default function AdminMembers() {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState<User | null>(null);
  const [editRole, setEditRole] = useState("user");
  const [editStatus, setEditStatus] = useState("active");

  // Load users from Supabase
  useEffect(() => {
    if (!isSupabaseEnabled) {
      setIsLoading(false);
      return;
    }

    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const { data: profiles, error: profileError } = await supabase!
          .from("user_profiles")
          .select(`
            id,
            full_name,
            city_name_ar,
            role,
            created_at,
            user:user_id (
              id,
              email,
              banned
            )
          `)
          .order("created_at", { ascending: false })
          .limit(100);

        if (profileError) throw profileError;

        const mappedUsers: User[] = (profiles || []).map((p: any) => ({
          id: p.id,
          name: p.full_name || "ط¨ط¯ظˆظ† ط§ط³ظ…",
          email: p.user?.email || "",
          city: p.city_name_ar || "ط؛ظٹط± ظ…ط­ط¯ط¯",
          role: p.role || "user",
          status: p.user?.banned ? "banned" as const : "active" as const,
          created_at: p.created_at ? new Date(p.created_at).toISOString().split("T")[0] : "",
        }));

        setUsers(mappedUsers);
      } catch (err) {
        console.error("[AdminMembers] Error loading users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, search]);

  const counts = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    banned: users.filter(u => u.status === "banned").length,
    admins: users.filter(u => u.role === "admin" || u.role === "super_admin" || u.role === "owner").length,
  }), [users]);

  const openDetail = (u: User) => {
    setDetail(u);
    setEditRole(u.role);
    setEditStatus(u.status);
  };

  const handleSave = () => {
    toast({ title: "ط؛ظٹط± ظ…طھط§ط­ ظ…ظ† ط§ظ„ظ…طھطµظپط­", description: MEMBER_ADMIN_ENDPOINT_REQUIRED, variant: "destructive" });
  };

  const handleToggleBan = () => {
    toast({ title: "ط؛ظٹط± ظ…طھط§ط­ ظ…ظ† ط§ظ„ظ…طھطµظپط­", description: MEMBER_ADMIN_ENDPOINT_REQUIRED, variant: "destructive" });
  };

  const statusMeta = (status: string) => STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[0];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-6 rounded-full"
          style={{ background: "linear-gradient(180deg, hsl(38 62% 52%), hsl(32 55% 42%))" }}
        />
        <h1 className="text-2xl font-extrabold" style={{ color: "hsl(22 62% 18%)" }}>
          ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†
        </h1>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "hsl(32 18% 42%)" }}>
          {filtered.length} ظ…ط³طھط®ط¯ظ…
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ", value: counts.total, icon: UsersIcon },
          { label: "ظ†ط´ط·ظˆظ†", value: counts.active, icon: CheckCircle },
          { label: "ظ…ط­ط¸ظˆط±ظˆظ†", value: counts.banned, icon: Ban },
          { label: "ظ…ط¯ظٹط±ظˆظ†", value: counts.admins, icon: UsersIcon },
        ].map(s => (
          <Card key={s.label} className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ط¨ط­ط« ط¨ط§ظ„ط§ط³ظ… ط£ظˆ ط§ظ„ط¨ط±ظٹط¯ ط£ظˆ ط§ظ„ظ…ط¯ظٹظ†ط©..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="md:w-36"><SelectValue placeholder="ط§ظ„ط¯ظˆط±" /></SelectTrigger>
          <SelectContent className="rtl">
            <SelectItem value="all">ظƒظ„ ط§ظ„ط£ط¯ظˆط§ط±</SelectItem>
            {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-36"><SelectValue placeholder="ط§ظ„ط­ط§ظ„ط©" /></SelectTrigger>
          <SelectContent className="rtl">
            <SelectItem value="all">ظƒظ„ ط§ظ„ط­ط§ظ„ط§طھ</SelectItem>
            {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">ظ„ط§ ظٹظˆط¬ط¯ ظ…ط³طھط®ط¯ظ…ظˆظ†</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right rtl">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">ط§ظ„ط§ط³ظ…</th>
                    <th className="px-4 py-3 font-medium">ط§ظ„ط¨ط±ظٹط¯</th>
                    <th className="px-4 py-3 font-medium">ط§ظ„ظ…ط¯ظٹظ†ط©</th>
                    <th className="px-4 py-3 font-medium">ط§ظ„ط¯ظˆط±</th>
                    <th className="px-4 py-3 font-medium">ط§ظ„ط­ط§ظ„ط©</th>
                    <th className="px-4 py-3 font-medium">طھط§ط±ظٹط® ط§ظ„طھط³ط¬ظٹظ„</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(u => {
                    const sm = statusMeta(u.status);
                    return (
                      <tr key={u.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground dir-ltr">{u.email}</td>
                        <td className="px-4 py-3">{u.city}</td>
                        <td className="px-4 py-3">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                            {ROLES.find(r => r.value === u.role)?.label ?? u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${sm.color}`}>{sm.label}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{u.created_at}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleBan()} disabled title={MEMBER_ADMIN_ENDPOINT_REQUIRED}>
                              {u.status === "banned" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Ban className="w-4 h-4 text-red-500" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(u)}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!detail} onOpenChange={open => { if (!open) setDetail(null); }}>
        <DialogContent className="rtl max-w-[400px] rounded-xl">
          <DialogHeader><DialogTitle>طھط¹ط¯ظٹظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4 py-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-2">
                  <UsersIcon className="w-8 h-8 text-primary" />
                </div>
                <div className="font-bold text-lg">{detail.name}</div>
                <div className="text-sm text-muted-foreground dir-ltr">{detail.email}</div>
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ط¯ظˆط±</Label>
                <Select value={editRole} onValueChange={setEditRole} disabled>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="rtl">
                    {ROLES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ط­ط§ظ„ط©</Label>
                <Select value={editStatus} onValueChange={setEditStatus} disabled>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="rtl">
                    {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                {MEMBER_ADMIN_ENDPOINT_REQUIRED}
              </p>
              <Button className="w-full" onClick={handleSave} disabled>
                ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

