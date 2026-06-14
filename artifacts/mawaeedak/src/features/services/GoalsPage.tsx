/**
 * GoalsPage â€” Phase 16 Production Hardening
 * 
 * Goals service with real Supabase sync for logged-in users.
 * Local fallback for guests with clear indicator.
 * 
 * Storage behavior:
 * - Logged in + Supabase: reads/writes from Supabase
 * - Not logged in or Supabase unavailable: localStorage fallback
 * 
 * Schema: supabase/migrations/20250612000002_create_services_tables.sql
 */

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Target, Edit2, Trash2, Check, Calendar, Coins, AlertCircle, TrendingUp, Cloud } from "lucide-react";
import { useGoalsGateway, type Goal, type GoalType } from "@/lib/gateways/goalsGateway";

function computeStats(goal: Goal) {
  const remaining = goal.targetAmount ? goal.targetAmount - goal.currentProgress : null;
  const progressPercent = goal.targetAmount
    ? Math.min(100, Math.round((goal.currentProgress / goal.targetAmount) * 100))
    : 0;
  
  let dailyNeeded: number | null = null;
  let weeklyNeeded: number | null = null;
  
  if (remaining && remaining > 0 && goal.deadline) {
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      dailyNeeded = remaining / daysLeft;
      weeklyNeeded = dailyNeeded * 7;
    }
  }
  
  return { remaining, progressPercent, dailyNeeded, weeklyNeeded };
}

export default function GoalsPage() {
  const { toast } = useToast();
  const { goals, isLoading, isError, isSynced, add, update, delete: deleteGoal, complete, updateProgress } = useGoalsGateway();
  
  // Form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [completingGoalId, setCompletingGoalId] = useState<string | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<GoalType>("financial");
  const [formTargetAmount, setFormTargetAmount] = useState("");
  const [formRequirements, setFormRequirements] = useState("");
  const [formCurrentProgress, setFormCurrentProgress] = useState("");
  const [formDeadline, setFormDeadline] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  
  const resetForm = () => {
    setFormName("");
    setFormType("financial");
    setFormTargetAmount("");
    setFormRequirements("");
    setFormCurrentProgress("");
    setFormDeadline("");
  };
  
  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormName(goal.name);
    setFormType(goal.type);
    setFormTargetAmount(goal.targetAmount?.toString() || "");
    setFormRequirements(goal.requirements);
    setFormCurrentProgress(goal.currentProgress?.toString() || "");
    setFormDeadline(goal.deadline || "");
    setIsEditOpen(true);
  };
  
  const handleAdd = async () => {
    if (!formName.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ‡ط¯ظپ", variant: "destructive" });
      return;
    }
    
    if (formType === "financial" && !formTargetAmount) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط³طھظ‡ط¯ظپ", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await add({
        name: formName.trim(),
        type: formType,
        targetAmount: formType === "financial" ? parseFloat(formTargetAmount) || 0 : null,
        requirements: formRequirements,
        currentProgress: parseFloat(formCurrentProgress) || 0,
        deadline: formDeadline || null,
      });
      
      toast({ title: "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ‡ط¯ظپ" });
      setIsAddOpen(false);
      resetForm();
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط¥ط¶ط§ظپط©", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleEdit = async () => {
    if (!editingGoal) return;
    
    if (!formName.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ‡ط¯ظپ", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await update({
        ...editingGoal,
        name: formName.trim(),
        type: formType,
        targetAmount: formType === "financial" ? parseFloat(formTargetAmount) || 0 : null,
        requirements: formRequirements,
        currentProgress: parseFloat(formCurrentProgress) || 0,
        deadline: formDeadline || null,
      });
      
      toast({ title: "طھظ… طھط­ط¯ظٹط« ط§ظ„ظ‡ط¯ظپ" });
      setIsEditOpen(false);
      setEditingGoal(null);
      resetForm();
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„طھط­ط¯ظٹط«", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!deletingGoalId) return;
    
    try {
      await deleteGoal(deletingGoalId);
      toast({ title: "طھظ… ط­ط°ظپ ط§ظ„ظ‡ط¯ظپ" });
      setIsDeleteOpen(false);
      setDeletingGoalId(null);
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط­ط°ظپ", variant: "destructive" });
    }
  };
  
  const handleComplete = async () => {
    if (!completingGoalId) return;
    
    try {
      await complete(completingGoalId);
      toast({ title: "طھظ… ط¥ظƒظ…ط§ظ„ ط§ظ„ظ‡ط¯ظپ! ًںژ‰" });
      setIsCompleteOpen(false);
      setCompletingGoalId(null);
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£", variant: "destructive" });
    }
  };
  
  const activeGoals = goals.filter(g => !g.completedAt);
  const completedGoals = goals.filter(g => g.completedAt);
  
  return (
    <AppShell title="ط§ط­ط³ط¨ ظ‡ط¯ظپظƒ" showBack>
      <div className="space-y-5 pb-6">
        
        {/* Sync status indicator */}
        {isSynced ? (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <Cloud className="w-4 h-4" />
            <span>ظ…طھط²ط§ظ…ظ† ظ…ط¹ ط§ظ„ط³ط­ط§ط¨ط©</span>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-2 text-xs" style={{ color: "#92400e" }}>
            <span className="font-semibold">ًں’¾ ظ…ظ„ط§ط­ط¸ط©:</span> ظ…ط­ظپظˆط¸ ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط¬ظ‡ط§ط² ظپظ‚ط·. ط³ط¬ظ‘ظ„ ط§ظ„ط¯ط®ظˆظ„ ظ„ظ…ط²ط§ظ…ظ†ط© ط¨ظٹط§ظ†ط§طھظƒ.
          </div>
        )}
        
        {/* Add Button */}
        <div className="flex justify-center">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 text-base font-bold rounded-2xl" style={{
                background: "linear-gradient(135deg, hsl(36 72% 52%), hsl(28 68% 38%))",
              }}>
                <Plus className="w-5 h-5 ml-2" />
                ط¥ط¶ط§ظپط© ظ‡ط¯ظپ ط¬ط¯ظٹط¯
              </Button>
            </DialogTrigger>
            <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>ط¥ط¶ط§ظپط© ظ‡ط¯ظپ ط¬ط¯ظٹط¯</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>ط§ط³ظ… ط§ظ„ظ‡ط¯ظپ *</Label>
                  <Input 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)} 
                    placeholder="ظ…ط«ط§ظ„: ط´ط±ط§ط، ط³ظٹط§ط±ط©"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>ظ†ظˆط¹ ط§ظ„ظ‡ط¯ظپ</Label>
                  <Select value={formType} onValueChange={(v) => setFormType(v as GoalType)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rtl">
                      <SelectItem value="financial">ظ…ط§ظ„ظٹ</SelectItem>
                      <SelectItem value="non-financial">ط؛ظٹط± ظ…ط§ظ„ظٹ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formType === "financial" && (
                  <>
                    <div className="space-y-2">
                      <Label>ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط³طھظ‡ط¯ظپ *</Label>
                      <Input 
                        type="number"
                        value={formTargetAmount} 
                        onChange={e => setFormTargetAmount(e.target.value)} 
                        placeholder="100000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>ط§ظ„طھظ‚ط¯ظ… ط§ظ„ط­ط§ظ„ظٹ</Label>
                      <Input 
                        type="number"
                        value={formCurrentProgress} 
                        onChange={e => setFormCurrentProgress(e.target.value)} 
                        placeholder="0"
                      />
                    </div>
                  </>
                )}
                
                {formType === "non-financial" && (
                  <div className="space-y-2">
                    <Label>ط§ظ„ظ…طھط·ظ„ط¨ط§طھ</Label>
                    <Textarea 
                      value={formRequirements} 
                      onChange={e => setFormRequirements(e.target.value)} 
                      placeholder="ط§ظƒطھط¨ ظ…طھط·ظ„ط¨ط§طھظƒ ظ‡ظ†ط§..."
                      rows={3}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>ط§ظ„ظ…ظˆط¹ط¯ ط§ظ„ظ†ظ‡ط§ط¦ظٹ</Label>
                  <Input 
                    type="date"
                    value={formDeadline} 
                    onChange={e => setFormDeadline(e.target.value)} 
                  />
                </div>
                
                <Button 
                  className="w-full h-11 font-bold" 
                  onClick={handleAdd}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„ظ‡ط¯ظپ"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Active Goals */}
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(36 72% 52%)" }} />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="font-bold text-red-600">طھط¹ط°ظ‘ط± طھط­ظ…ظٹظ„ ط§ظ„ط£ظ‡ط¯ط§ظپ</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              ط¥ط¹ط§ط¯ط© ط§ظ„ظ…ط­ط§ظˆظ„ط©
            </Button>
          </div>
        ) : activeGoals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C9A063]/40 bg-[#FAF7F2] p-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: "#C9A063" }} />
            <h3 className="text-lg font-extrabold mb-2" style={{ color: "#2F2B25" }}>
              ظ„ط§ طھظˆط¬ط¯ ط£ظ‡ط¯ط§ظپ ظ†ط´ط·ط©
            </h3>
            <p className="text-sm font-medium" style={{ color: "#6F6557" }}>
              ط§ط¨ط¯ط£ ط¨ط¥ط¶ط§ظپط© ظ‡ط¯ظپ ط¬ط¯ظٹط¯ ظ„طھطھط¨ط¹ طھظ‚ط¯ظ…ظƒ
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map(goal => {
              const stats = computeStats(goal);
              const isFinancial = goal.type === "financial";
              
              return (
                <div
                  key={goal.id}
                  className="rounded-2xl border bg-white/82 p-4"
                  style={{
                    borderColor: "rgba(201,160,99,0.24)",
                    boxShadow: "0 14px 34px rgba(138,107,61,0.10)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                        background: "linear-gradient(135deg, hsl(36 72% 52% / 0.15), hsl(36 72% 52% / 0.05))",
                        border: "1px solid hsl(36 72% 52% / 0.3)",
                      }}>
                        <Target className="w-5 h-5" style={{ color: "#C9A063" }} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[16px]" style={{ color: "#2F2B25" }}>
                          {goal.name}
                        </h3>
                        <span className="text-xs font-medium" style={{ color: "#6F6557" }}>
                          {isFinancial ? "ظ‡ط¯ظپ ظ…ط§ظ„ظٹ" : "ظ‡ط¯ظپ ط؛ظٹط± ظ…ط§ظ„ظٹ"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => openEdit(goal)}
                      >
                        <Edit2 className="w-4 h-4" style={{ color: "#6F6557" }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => { setDeletingGoalId(goal.id); setIsDeleteOpen(true); }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  {isFinancial && goal.targetAmount ? (
                    <>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium" style={{ color: "#6F6557" }}>
                            {goal.currentProgress.toLocaleString()} / {goal.targetAmount.toLocaleString()} ط±ظٹط§ظ„
                          </span>
                          <span className="font-bold" style={{ color: "#8A6B3D" }}>
                            {stats.progressPercent}%
                          </span>
                        </div>
                        <Progress 
                          value={stats.progressPercent} 
                          className="h-2"
                          style={{
                            '--progress-background': 'linear-gradient(90deg, #C9A063, #E3C383)',
                          } as React.CSSProperties}
                        />
                      </div>
                      
                      {stats.remaining && stats.remaining > 0 && (
                        <div className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ background: "#F3E8D6/50" }}>
                          <TrendingUp className="w-4 h-4" style={{ color: "#8A6B3D" }} />
                          <span style={{ color: "#6F6557" }}>
                            ظ…طھط¨ظ‚ظٹ: {stats.remaining.toLocaleString()} ط±ظٹط§ظ„
                            {stats.dailyNeeded && ` â€¢ طھط­طھط§ط¬ ${Math.round(stats.dailyNeeded).toLocaleString()} ط±ظٹط§ظ„/ظٹظˆظ…`}
                          </span>
                        </div>
                      )}
                    </>
                  ) : goal.requirements ? (
                    <p className="text-sm" style={{ color: "#6F6557" }}>
                      {goal.requirements}
                    </p>
                  ) : null}
                  
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(201,160,99,0.15)" }}>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "#6F6557" }}>
                      <Calendar className="w-3 h-3" />
                      {goal.deadline ? new Date(goal.deadline).toLocaleDateString("ar-SA") : "ط¨ط¯ظˆظ† ظ…ظˆط¹ط¯"}
                    </div>
                    
                    <Button
                      size="sm"
                      className="h-8 text-xs font-bold"
                      onClick={() => { setCompletingGoalId(goal.id); setIsCompleteOpen(true); }}
                      style={{
                        background: "linear-gradient(135deg, hsl(142 60% 45%), hsl(142 60% 38%))",
                      }}
                    >
                      <Check className="w-3 h-3 ml-1" />
                      ط£ظƒظ…ظ„ ط§ظ„ظ‡ط¯ظپ
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-[16px]" style={{ color: "#8A6B3D" }}>
              ط§ظ„ط£ظ‡ط¯ط§ظپ ط§ظ„ظ…ظƒطھظ…ظ„ط©
            </h3>
            {completedGoals.map(goal => (
              <div
                key={goal.id}
                className="rounded-2xl border bg-green-50/50 p-4 opacity-70"
                style={{ borderColor: "rgba(34, 197, 94, 0.3)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-through" style={{ color: "#6F6557" }}>
                      {goal.name}
                    </h4>
                    <p className="text-xs" style={{ color: "#6F6557" }}>
                      ط£ظƒظ…ظ„ ظپظٹ: {new Date(goal.completedAt!).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => { setDeletingGoalId(goal.id); setIsDeleteOpen(true); }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Delete Confirm */}
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="ط­ط°ظپ ط§ظ„ظ‡ط¯ظپ"
          description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ‡ط°ط§ ط§ظ„ظ‡ط¯ظپطں ظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھط±ط§ط¬ط¹."
          confirmText="ط­ط°ظپ"
          onConfirm={handleDelete}
          destructive
        />
        
        {/* Complete Confirm */}
        <ConfirmDialog
          open={isCompleteOpen}
          onOpenChange={setIsCompleteOpen}
          title="ط¥ظƒظ…ط§ظ„ ط§ظ„ظ‡ط¯ظپ"
          description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط¥ظƒظ…ط§ظ„ ظ‡ط°ط§ ط§ظ„ظ‡ط¯ظپطں"
          confirmText="ظ†ط¹ظ…طŒ ط£ظƒظ…ظ„"
          onConfirm={handleComplete}
        />
        
        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>طھط¹ط¯ظٹظ„ ط§ظ„ظ‡ط¯ظپ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ط§ط³ظ… ط§ظ„ظ‡ط¯ظپ *</Label>
                <Input value={formName} onChange={e => setFormName(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label>ظ†ظˆط¹ ط§ظ„ظ‡ط¯ظپ</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as GoalType)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent className="rtl">
                    <SelectItem value="financial">ظ…ط§ظ„ظٹ</SelectItem>
                    <SelectItem value="non-financial">ط؛ظٹط± ظ…ط§ظ„ظٹ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formType === "financial" && (
                <>
                  <div className="space-y-2">
                    <Label>ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط³طھظ‡ط¯ظپ *</Label>
                    <Input type="number" value={formTargetAmount} onChange={e => setFormTargetAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>ط§ظ„طھظ‚ط¯ظ… ط§ظ„ط­ط§ظ„ظٹ</Label>
                    <Input type="number" value={formCurrentProgress} onChange={e => setFormCurrentProgress(e.target.value)} />
                  </div>
                </>
              )}
              
              {formType === "non-financial" && (
                <div className="space-y-2">
                  <Label>ط§ظ„ظ…طھط·ظ„ط¨ط§طھ</Label>
                  <Textarea value={formRequirements} onChange={e => setFormRequirements(e.target.value)} rows={3} />
                </div>
              )}
              
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ظˆط¹ط¯ ط§ظ„ظ†ظ‡ط§ط¦ظٹ</Label>
                <Input type="date" value={formDeadline} onChange={e => setFormDeadline(e.target.value)} />
              </div>
              
              <Button className="w-full h-11 font-bold" onClick={handleEdit} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
      </div>
    </AppShell>
  );
}
