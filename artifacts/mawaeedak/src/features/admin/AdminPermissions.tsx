import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, Edit2 } from "lucide-react";

interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

const DEFAULT_PERMISSIONS = [
  "dashboard", "users.view", "users.edit", "users.delete",
  "messages.view", "messages.create", "messages.edit", "messages.delete",
  "news.view", "news.create", "news.edit", "news.delete",
  "jobs.view", "jobs.create", "jobs.edit", "jobs.delete",
  "financial.view", "financial.create", "financial.edit", "financial.delete",
  "notifications.view", "notifications.send", "notifications.delete",
  "themes.view", "themes.edit",
  "reports.view", "reports.export",
  "settings.view", "settings.edit",
  "social.view", "social.edit",
  "complaints.view", "complaints.reply",
];

const PERM_LABELS: Record<string, string> = {
  "dashboard": "ظ„ظˆط­ط© ط§ظ„ظ†ط¸ط±ط© ط§ظ„ط¹ط§ظ…ط©",
  "users.view": "ط¹ط±ط¶ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†",
  "users.edit": "طھط¹ط¯ظٹظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†",
  "users.delete": "ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†",
  "messages.view": "ط¹ط±ط¶ ط§ظ„ط±ط³ط§ط¦ظ„",
  "messages.create": "ط¥ظ†ط´ط§ط، ط±ط³ط§ظ„ط©",
  "messages.edit": "طھط¹ط¯ظٹظ„ ط±ط³ط§ظ„ط©",
  "messages.delete": "ط­ط°ظپ ط±ط³ط§ظ„ط©",
  "news.view": "ط¹ط±ط¶ ط§ظ„ط£ط®ط¨ط§ط±",
  "news.create": "ط¥ظ†ط´ط§ط، ط®ط¨ط±",
  "news.edit": "طھط¹ط¯ظٹظ„ ط®ط¨ط±",
  "news.delete": "ط­ط°ظپ ط®ط¨ط±",
  "jobs.view": "ط¹ط±ط¶ ط§ظ„ظˆط¸ط§ط¦ظپ",
  "jobs.create": "ط¥ظ†ط´ط§ط، ظˆط¸ظٹظپط©",
  "jobs.edit": "طھط¹ط¯ظٹظ„ ظˆط¸ظٹظپط©",
  "jobs.delete": "ط­ط°ظپ ظˆط¸ظٹظپط©",
  "financial.view": "ط¹ط±ط¶ ط§ظ„ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط§ظ„ظٹط©",
  "financial.create": "ط¥ظ†ط´ط§ط، ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ",
  "financial.edit": "طھط¹ط¯ظٹظ„ ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ",
  "financial.delete": "ط­ط°ظپ ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ",
  "notifications.view": "ط¹ط±ط¶ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ",
  "notifications.send": "ط¥ط±ط³ط§ظ„ ط¥ط´ط¹ط§ط±",
  "notifications.delete": "ط­ط°ظپ ط¥ط´ط¹ط§ط±",
  "themes.view": "ط¹ط±ط¶ ط§ظ„ط«ظٹظ…ط§طھ",
  "themes.edit": "طھط¹ط¯ظٹظ„ ط§ظ„ط«ظٹظ…ط§طھ",
  "reports.view": "ط¹ط±ط¶ ط§ظ„طھظ‚ط§ط±ظٹط±",
  "reports.export": "طھطµط¯ظٹط± ط§ظ„طھظ‚ط§ط±ظٹط±",
  "settings.view": "ط¹ط±ط¶ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ",
  "settings.edit": "طھط¹ط¯ظٹظ„ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ",
  "social.view": "ط¹ط±ط¶ ط§ظ„طھظˆط§طµظ„ ط§ظ„ط§ط¬طھظ…ط§ط¹ظٹ",
  "social.edit": "طھط¹ط¯ظٹظ„ ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ†ط´ط±",
  "complaints.view": "ط¹ط±ط¶ ط§ظ„ط´ظƒط§ظˆظ‰",
  "complaints.reply": "ط§ظ„ط±ط¯ ط¹ظ„ظ‰ ط§ظ„ط´ظƒط§ظˆظ‰",
};

const ROLES: Role[] = [
  { id: "owner", name: "owner", label: "ظ…ط§ظ„ظƒ ط§ظ„ظ†ط¸ط§ظ…", description: "طµظ„ط§ط­ظٹط§طھ ظƒط§ظ…ظ„ط© ط¹ظ„ظ‰ ط§ظ„ظ†ط¸ط§ظ… ظˆط§ظ„ظ…ظ†طµط©", permissions: [...DEFAULT_PERMISSIONS], isSystem: true },
  { id: "super_admin", name: "super_admin", label: "ظ…ط¯ظٹط± ظ†ط¸ط§ظ…", description: "ط¥ط¯ط§ط±ط© ظƒط§ظ…ظ„ط© ظ„ط¬ظ…ظٹط¹ ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ظ†طµط©", permissions: [...DEFAULT_PERMISSIONS], isSystem: true },
  { id: "admin", name: "admin", label: "ظ…ط¯ظٹط±", description: "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط­طھظˆظ‰ ظˆط§ظ„ط±ط³ط§ط¦ظ„ ظˆط§ظ„ط¥ط´ط¹ط§ط±ط§طھ", permissions: ["dashboard", "messages.view", "messages.create", "messages.edit", "messages.delete", "news.view", "news.create", "news.edit", "jobs.view", "jobs.create", "jobs.edit", "notifications.view", "notifications.send", "complaints.view", "complaints.reply", "reports.view"], isSystem: true },
  { id: "content_manager", name: "content_manager", label: "ظ…ط¯ظٹط± ظ…ط­طھظˆظ‰", description: "ط¥ط¯ط§ط±ط© ط§ظ„ط±ط³ط§ط¦ظ„ ظˆط§ظ„ط£ط®ط¨ط§ط± ظˆط§ظ„ظˆط¸ط§ط¦ظپ", permissions: ["dashboard", "messages.view", "messages.create", "messages.edit", "news.view", "news.create", "news.edit", "news.delete", "jobs.view", "jobs.create", "jobs.edit", "jobs.delete", "complaints.view"], isSystem: false },
  { id: "support_manager", name: "support_manager", label: "ظ…ط¯ظٹط± ط¯ط¹ظ…", description: "ط§ظ„ط±ط¯ ط¹ظ„ظ‰ ط§ظ„ط´ظƒط§ظˆظ‰ ظˆط§ظ„ط¯ط¹ظ… ط§ظ„ظپظ†ظٹ", permissions: ["dashboard", "complaints.view", "complaints.reply", "notifications.view", "notifications.send"], isSystem: false },
  { id: "user", name: "user", label: "ظ…ط³طھط®ط¯ظ…", description: "طµظ„ط§ط­ظٹط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط¹ط§ط¯ظٹ", permissions: ["dashboard"], isSystem: true },
];

export default function AdminPermissions() {
  const { toast } = useToast();
  const roles = ROLES;
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);

  const openEdit = (role: Role) => {
    setEditRole(role);
    setEditPerms([...role.permissions]);
  };

  const togglePerm = (perm: string) => {
    setEditPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  const handleSave = () => {
    if (!editRole) return;
    toast({
      title: "طھط¹ط¯ظٹظ„ ط§ظ„طµظ„ط§ط­ظٹط§طھ ط؛ظٹط± ظ…طھط§ط­ ظ…ظ† ط§ظ„ظ…طھطµظپط­",
      description: "ط¥ط¯ط§ط±ط© ط§ظ„طµظ„ط§ط­ظٹط§طھ طھطھط·ظ„ط¨ endpoint ط¥ط¯ط§ط±ظٹ server-side ظˆط³ظٹط§ط³ط§طھ RLS ظ…ط·ط¨ظ‘ظ‚ط©.",
      variant: "destructive",
    });
  };

  const getPermGroups = () => {
    const groups: Record<string, string[]> = {};
    editPerms.forEach(p => {
      const group = p.split(".")[0];
      if (!groups[group]) groups[group] = [];
      groups[group].push(p);
    });
    return groups;
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
          ط§ظ„طµظ„ط§ط­ظٹط§طھ
        </h1>
      </div>

      {/* Roles list */}
      <div className="grid gap-4">
        {roles.map(role => (
          <Card key={role.id} className={`border-border shadow-sm ${role.isSystem ? "border-l-4 border-l-primary" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{role.label}</h3>
                      {role.isSystem && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">ط£ط³ط§ط³ظٹ</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.permissions.slice(0, 5).map(p => (
                        <span key={p} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{PERM_LABELS[p] ?? p}</span>
                      ))}
                      {role.permissions.length > 5 && (
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">+{role.permissions.length - 5}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0" onClick={() => openEdit(role)} disabled={role.isSystem && role.id === "owner"}>
                  {role.id === "owner" ? <Shield className="w-4 h-4 text-muted-foreground" /> : <Edit2 className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Permissions Dialog */}
      <Dialog open={!!editRole} onOpenChange={open => { if (!open) setEditRole(null); }}>
        <DialogContent className="rtl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>طھط¹ط¯ظٹظ„ طµظ„ط§ط­ظٹط§طھ: {editRole?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {DEFAULT_PERMISSIONS.filter(p => p.includes(".")).map(perm => (
              <div key={perm} className="flex items-center justify-between">
                <Label htmlFor={perm} className="text-sm cursor-pointer">{PERM_LABELS[perm] ?? perm}</Label>
                <Switch
                  id={perm}
                  checked={editPerms.includes(perm)}
                  onCheckedChange={() => togglePerm(perm)}
                  disabled
                />
              </div>
            ))}
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              ط¥ط¯ط§ط±ط© ط§ظ„طµظ„ط§ط­ظٹط§طھ ظ„ظ„ظ‚ط±ط§ط،ط© ظپظ‚ط· ط¯ط§ط®ظ„ ط§ظ„ظ…طھطµظپط­. ط£ظٹ طھط¹ط¯ظٹظ„ ظٹطھط·ظ„ط¨ endpoint ط¥ط¯ط§ط±ظٹ server-side.
            </p>
            <Button className="w-full mt-4" onClick={handleSave} disabled>
              ط­ظپط¸ ط§ظ„طµظ„ط§ط­ظٹط§طھ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

