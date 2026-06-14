import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useGatewayFinancialEvents, gwQueryKeys } from "@/hooks/useGatewayData";
import { gwCreateFinancialEvent, gwUpdateFinancialEvent, gwDeleteFinancialEvent } from "@/lib/dataGateway";
import { Plus, Edit2, Trash2, Loader2, Wallet, Receipt } from "lucide-react";

export default function AdminFinancial() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState("all");
  const { data: allEvents, isLoading } = useGatewayFinancialEvents();
  const events = useMemo(() => {
    const rows = Array.isArray(allEvents) ? allEvents : [];
    if (filterType === "all") return rows;
    return rows.filter((event: any) => event.type === filterType);
  }, [allEvents, filterType]);

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [type, setType] = useState("salary");
  const [nextDate, setNextDate] = useState("");
  const [amount, setAmount] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const invalidateFinancial = () => {
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.financialEvents });
    queryClient.invalidateQueries({ queryKey: gwQueryKeys.financialCountdown });
  };

  const openAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setName("");
    setType("salary");
    setNextDate("");
    setAmount("");
    setIsActive(true);
    setIsOpen(true);
  };

  const openEdit = (ev: any) => {
    setIsEdit(true);
    setEditId(ev.id);
    setName(ev.name);
    setType(ev.type);
    setNextDate(ev.next_date);
    setAmount(ev.amount ? String(ev.amount) : "");
    setIsActive(ev.is_active);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !nextDate) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط§ط³ظ… ظˆط§ظ„طھط§ط±ظٹط® ظ…ط·ظ„ظˆط¨ط§ظ†", variant: "destructive" });
      return;
    }

    const data = {
      name: name.trim(),
      type,
      next_date: nextDate,
      amount: amount ? Number(amount) : null,
      is_active: isActive,
    };

    setIsSaving(true);
    try {
      const result = isEdit && editId
        ? await gwUpdateFinancialEvent(editId, data)
        : await gwCreateFinancialEvent(data);

      if (!result.success) {
        toast({ title: "ظپط´ظ„ ط§ظ„ط­ظپط¸", description: result.error ?? "طھط¹ط°ط± ط­ظپط¸ ط§ظ„ظ…ظˆط¹ط¯ ط§ظ„ظ…ط§ظ„ظٹ", variant: "destructive" });
        return;
      }

      toast({ title: isEdit ? "طھظ… ط§ظ„طھط¹ط¯ظٹظ„" : "طھظ…طھ ط§ظ„ط¥ط¶ط§ظپط©" });
      setIsOpen(false);
      invalidateFinancial();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const result = await gwDeleteFinancialEvent(deleteId);
      if (!result.success) {
        toast({ title: "ظپط´ظ„ ط§ظ„ط­ط°ظپ", description: result.error ?? "طھط¹ط°ط± ط­ط°ظپ ط§ظ„ظ…ظˆط¹ط¯ ط§ظ„ظ…ط§ظ„ظٹ", variant: "destructive" });
        return;
      }
      toast({ title: "طھظ… ط§ظ„ط­ط°ظپ" });
      setIsDeleteOpen(false);
      setDeleteId(null);
      invalidateFinancial();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-1 h-6 rounded-full"
            style={{ background: "linear-gradient(180deg, hsl(38 62% 52%), hsl(32 55% 42%))" }}
          />
          <h1 className="text-2xl font-extrabold" style={{ color: "hsl(22 62% 18%)" }}>
            ط§ظ„ط±ظˆط§طھط¨ ظˆط§ظ„ط¯ط¹ظ…
          </h1>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus className="w-4 h-4 ml-1" /> ط¥ط¶ط§ظپط© ظ…ظˆط¹ط¯
        </Button>
      </div>
      
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-full bg-card">
          <SelectValue placeholder="طھطµظپظٹط© ط­ط³ط¨ ط§ظ„ظ†ظˆط¹" />
        </SelectTrigger>
        <SelectContent className="rtl">
          <SelectItem value="all">ط§ظ„ظƒظ„</SelectItem>
          <SelectItem value="salary">ط±ظˆط§طھط¨</SelectItem>
          <SelectItem value="support">ط¯ط¹ظ… ط­ظƒظˆظ…ظٹ</SelectItem>
          <SelectItem value="bill">ظپظˆط§طھظٹط± ظˆط§ظ„طھط²ط§ظ…ط§طھ</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "طھط¹ط¯ظٹظ„ ط§ظ„ظ…ظˆط¹ط¯ ط§ظ„ظ…ط§ظ„ظٹ" : "ظ…ظˆط¹ط¯ ظ…ط§ظ„ظٹ ط¬ط¯ظٹط¯"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ط§ط³ظ… ط§ظ„ظ…ظˆط¹ط¯ / ط§ظ„ط¬ظ‡ط©</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="ظ…ط«ط§ظ„: ط­ط³ط§ط¨ ط§ظ„ظ…ظˆط§ط·ظ†" />
            </div>
            <div className="space-y-2">
              <Label>ط§ظ„ظ†ظˆط¹</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="rtl">
                  <SelectItem value="salary">ط±ط§طھط¨</SelectItem>
                  <SelectItem value="support">ط¯ط¹ظ…</SelectItem>
                  <SelectItem value="bill">ظپط§طھظˆط±ط©/ط§ظ„طھط²ط§ظ…</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>طھط§ط±ظٹط® ط§ظ„ط§ط³طھط­ظ‚ط§ظ‚</Label>
                <Input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ط¨ظ„ط؛ (ط§ط®طھظٹط§ط±ظٹ)</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>ظ…ظپط¹ظ‘ظ„ ظˆظٹط¸ظ‡ط± ظ„ظ„ط¬ظ…ظٹط¹</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : events.length > 0 ? (
        <div className="space-y-3">
          {events.map((ev: any) => (
            <Card key={ev.id} className={`border-border shadow-sm overflow-hidden ${!ev.is_active ? 'opacity-60' : ''}`}>
              <div className="flex border-r-4" style={{ borderRightColor: ev.type === 'salary' ? 'hsl(var(--primary))' : ev.type === 'bill' ? 'hsl(var(--destructive))' : 'hsl(var(--accent))' }}>
                <CardContent className="p-4 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {ev.type === 'bill' ? <Receipt className="w-4 h-4 text-destructive" /> : <Wallet className="w-4 h-4 text-primary" />}
                      <h4 className="font-bold text-sm">{ev.name}</h4>
                    </div>
                    {ev.amount && <span className="font-bold text-sm text-primary">{ev.amount} ط±.ط³</span>}
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-3 mt-2">
                    <div className="text-xs text-muted-foreground">ط§ظ„طھط§ط±ظٹط®: {ev.next_date}</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => openEdit(ev)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeleteId(ev.id); setIsDeleteOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-card rounded-xl border border-dashed border-border text-muted-foreground">
          ظ„ط§ طھظˆط¬ط¯ ظ…ظˆط§ط¹ظٹط¯ ظ…ط§ظ„ظٹط©
        </div>
      )}

      <ConfirmDialog 
        open={isDeleteOpen} onOpenChange={setIsDeleteOpen}
        title="ط­ط°ظپ ط§ظ„ظ…ظˆط¹ط¯ ط§ظ„ظ…ط§ظ„ظٹ" description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط§ظ„ط­ط°ظپطں ظ‡ط°ط§ ط³ظٹط¤ط«ط± ط¹ظ„ظ‰ ط¹ط¯ط§ط¯ط§طھ ط¬ظ…ظٹط¹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†."
        onConfirm={handleDelete}
        confirmText={isDeleting ? "ط¬ط§ط±ظٹ ط§ظ„ط­ط°ظپ..." : "طھط£ظƒظٹط¯"}
      />
    </div>
  );
}

