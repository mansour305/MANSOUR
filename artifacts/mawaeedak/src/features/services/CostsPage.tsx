/**
 * CostsPage â€” Phase 14 P0-4
 * 
 * Cost Projects service: Create, edit, delete cost projects with:
 * - Unlimited items depending on plan limits
 * - Each item: name, amount, paid amount, remaining amount, status, scheduled date, notes
 * - Auto total, paid, remaining
 * - Project buttons: add item, edit, delete, save, share, export, calendar event, clear all
 * - Item buttons: edit, delete, mark as paid, schedule
 * 
 * Storage: Local-first with optional Supabase cloud sync when logged in.
 * Schema exists at: supabase/migrations/20250612000002_create_services_tables.sql
 * UI shows "ظ…ط­ظپظˆط¸ ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط¬ظ‡ط§ط² ظپظ‚ط·" when not synced.
 */

import { useState, useMemo, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/layout/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Loader2, Calculator, Edit2, Trash2, Check, 
  Calendar, Coins, AlertCircle, ChevronDown, ChevronUp,
  Share2
} from "lucide-react";

export type CostItemStatus = "partial" | "fully_paid" | "scheduled";

export type CostItem = {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: CostItemStatus;
  scheduledDate: string | null;
  notes: string;
  createdAt: string;
};

export type CostProject = {
  id: string;
  name: string;
  items: CostItem[];
  createdAt: string;
  updatedAt: string;
};

const COSTS_STORAGE_KEY = "mawaeedak_cost_projects_v1";

function loadProjects(): CostProject[] {
  try {
    const stored = localStorage.getItem(COSTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore
  }
  return [];
}

function saveProjects(projects: CostProject[]): void {
  try {
    localStorage.setItem(COSTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Ignore
  }
}

function generateId(): string {
  return `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function computeProjectTotals(project: CostProject) {
  const total = project.items.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = project.items.reduce((sum, item) => sum + item.paidAmount, 0);
  const totalRemaining = project.items.reduce((sum, item) => sum + item.remainingAmount, 0);
  const progressPercent = total > 0 ? Math.min(100, Math.round((totalPaid / total) * 100)) : 0;
  
  return { total, totalPaid, totalRemaining, progressPercent };
}

export default function CostsPage() {
  const { toast } = useToast();
  
  // State
  const [projects, setProjects] = useState<CostProject[]>(loadProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  // Dialogs
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [isPaidConfirmOpen, setIsPaidConfirmOpen] = useState(false);
  
  // Selected items
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [markAsPaidItemId, setMarkAsPaidItemId] = useState<string | null>(null);
  
  // Form state - Project
  const [formProjectName, setFormProjectName] = useState("");
  
  // Form state - Item
  const [formItemName, setFormItemName] = useState("");
  const [formItemAmount, setFormItemAmount] = useState("");
  const [formItemPaidAmount, setFormItemPaidAmount] = useState("");
  const [formItemNotes, setFormItemNotes] = useState("");
  const [formItemScheduledDate, setFormItemScheduledDate] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Persist to localStorage
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);
  
  // Get current project
  const currentProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
    [projects, selectedProjectId]
  );
  
  // Get current item
  const currentItem = useMemo(() => 
    currentProject?.items.find(i => i.id === selectedItemId),
    [currentProject, selectedItemId]
  );
  
  // Reset project form
  const resetProjectForm = () => {
    setFormProjectName("");
  };
  
  // Reset item form
  const resetItemForm = () => {
    setFormItemName("");
    setFormItemAmount("");
    setFormItemPaidAmount("");
    setFormItemNotes("");
    setFormItemScheduledDate("");
  };
  
  // Handle add project
  const handleAddProject = () => {
    if (!formProjectName.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ…ط´ط±ظˆط¹", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newProject: CostProject = {
        id: generateId(),
        name: formProjectName.trim(),
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setProjects(prev => [newProject, ...prev]);
      toast({ title: "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ظ…ط´ط±ظˆط¹" });
      setIsAddProjectOpen(false);
      resetProjectForm();
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط¥ط¶ط§ظپط©", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle edit project
  const handleEditProject = () => {
    if (!selectedProjectId || !formProjectName.trim()) return;
    
    setIsSaving(true);
    
    try {
      setProjects(prev => prev.map(p => 
        p.id === selectedProjectId 
          ? { ...p, name: formProjectName.trim(), updatedAt: new Date().toISOString() }
          : p
      ));
      toast({ title: "طھظ… طھط­ط¯ظٹط« ط§ظ„ظ…ط´ط±ظˆط¹" });
      setIsEditProjectOpen(false);
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„طھط­ط¯ظٹط«", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle delete project
  const handleDeleteProject = () => {
    if (!selectedProjectId) return;
    
    setProjects(prev => prev.filter(p => p.id !== selectedProjectId));
    toast({ title: "طھظ… ط­ط°ظپ ط§ظ„ظ…ط´ط±ظˆط¹" });
    setIsDeleteProjectOpen(false);
    setSelectedProjectId(null);
    setExpandedProject(null);
  };
  
  // Handle clear all items
  const handleClearAllItems = () => {
    if (!selectedProjectId) return;
    
    setProjects(prev => prev.map(p => 
      p.id === selectedProjectId 
        ? { ...p, items: [], updatedAt: new Date().toISOString() }
        : p
    ));
    toast({ title: "طھظ… ظ…ط³ط­ ط¬ظ…ظٹط¹ ط§ظ„ط¨ظ†ظˆط¯" });
    setIsClearAllOpen(false);
  };
  
  // Handle add item
  const handleAddItem = () => {
    if (!selectedProjectId) return;
    
    if (!formItemName.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط¨ظ†ط¯", variant: "destructive" });
      return;
    }
    
    if (!formItemAmount) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ظ„ظ…ط¨ظ„ط؛", variant: "destructive" });
      return;
    }
    
    const values = validateItemForm();
    if (!values) return;

    setIsSaving(true);
    
    try {
      const { amount, paidAmount } = values;
      
      const newItem: CostItem = {
        id: generateId(),
        name: formItemName.trim(),
        amount,
        paidAmount,
        remainingAmount: amount - paidAmount,
        status: paidAmount >= amount ? "fully_paid" : paidAmount > 0 ? "partial" : "scheduled",
        scheduledDate: formItemScheduledDate || null,
        notes: formItemNotes,
        createdAt: new Date().toISOString(),
      };
      
      setProjects(prev => prev.map(p => 
        p.id === selectedProjectId 
          ? { ...p, items: [...p.items, newItem], updatedAt: new Date().toISOString() }
          : p
      ));
      toast({ title: "طھظ… ط¥ط¶ط§ظپط© ط§ظ„ط¨ظ†ط¯" });
      setIsAddItemOpen(false);
      resetItemForm();
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط¥ط¶ط§ظپط©", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle edit item
  const handleEditItem = () => {
    if (!selectedProjectId || !selectedItemId) return;
    
    if (!formItemName.trim()) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ط±ط¬ط§ط، ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ط¨ظ†ط¯", variant: "destructive" });
      return;
    }
    
    const values = validateItemForm();
    if (!values) return;

    setIsSaving(true);
    
    try {
      const { amount, paidAmount } = values;
      
      setProjects(prev => prev.map(p => 
        p.id === selectedProjectId 
          ? {
              ...p,
              items: p.items.map(i => 
                i.id === selectedItemId 
                  ? {
                      ...i,
                      name: formItemName.trim(),
                      amount,
                      paidAmount,
                      remainingAmount: amount - paidAmount,
                      status: paidAmount >= amount ? "fully_paid" : paidAmount > 0 ? "partial" : "scheduled",
                      scheduledDate: formItemScheduledDate || null,
                      notes: formItemNotes,
                    }
                  : i
              ),
              updatedAt: new Date().toISOString(),
            }
          : p
      ));
      toast({ title: "طھظ… طھط­ط¯ظٹط« ط§ظ„ط¨ظ†ط¯" });
      setIsEditItemOpen(false);
      setSelectedItemId(null);
      resetItemForm();
    } catch {
      toast({ title: "ط®ط·ط£", description: "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„طھط­ط¯ظٹط«", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle delete item
  const handleDeleteItem = () => {
    if (!selectedProjectId || !selectedItemId) return;
    
    setProjects(prev => prev.map(p => 
      p.id === selectedProjectId 
        ? { ...p, items: p.items.filter(i => i.id !== selectedItemId), updatedAt: new Date().toISOString() }
        : p
    ));
    toast({ title: "طھظ… ط­ط°ظپ ط§ظ„ط¨ظ†ط¯" });
    setIsDeleteItemOpen(false);
    setSelectedItemId(null);
  };
  
  // Handle mark as paid
  const handleMarkAsPaid = (deduct: boolean) => {
    if (!selectedProjectId || !markAsPaidItemId) return;
    
    setProjects(prev => prev.map(p => 
      p.id === selectedProjectId 
        ? {
            ...p,
            items: p.items.map(i => 
              i.id === markAsPaidItemId 
                ? {
                    ...i,
                    paidAmount: deduct ? i.amount : i.paidAmount + i.remainingAmount,
                    remainingAmount: 0,
                    status: "fully_paid" as CostItemStatus,
                  }
                : i
            ),
            updatedAt: new Date().toISOString(),
          }
        : p
    ));
    toast({ title: "طھظ… طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„ط¨ظ†ط¯" });
    setIsPaidConfirmOpen(false);
    setMarkAsPaidItemId(null);
  };
  
  // Open edit project
  const openEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectId(projectId);
      setFormProjectName(project.name);
      setIsEditProjectOpen(true);
    }
  };
  
  // Open add item
  const openAddItem = (projectId: string) => {
    setSelectedProjectId(projectId);
    resetItemForm();
    setIsAddItemOpen(true);
  };
  
  // Open edit item
  const openEditItem = (item: CostItem) => {
    if (!selectedProjectId) return;
    setSelectedItemId(item.id);
    setFormItemName(item.name);
    setFormItemAmount(item.amount.toString());
    setFormItemPaidAmount(item.paidAmount.toString());
    setFormItemNotes(item.notes);
    setFormItemScheduledDate(item.scheduledDate || "");
    setIsEditItemOpen(true);
  };

  const validateItemForm = (): { amount: number; paidAmount: number } | null => {
    const amount = Number(formItemAmount);
    const paidAmount = formItemPaidAmount.trim() ? Number(formItemPaidAmount) : 0;

    if (!Number.isFinite(amount) || amount <= 0) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ ظٹط¬ط¨ ط£ظ† ظٹظƒظˆظ† ط£ظƒط¨ط± ظ…ظ† طµظپط±", variant: "destructive" });
      return null;
    }

    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹ ظٹط¬ط¨ ط£ظ† ظٹظƒظˆظ† ط±ظ‚ظ…ط§ظ‹ طµط­ظٹط­ط§ظ‹ ظ„ط§ ظٹظ‚ظ„ ط¹ظ† طµظپط±", variant: "destructive" });
      return null;
    }

    if (paidAmount > amount) {
      toast({ title: "ط®ط·ط£", description: "ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹ ظ„ط§ ظٹظ…ظƒظ† ط£ظ† ظٹطھط¬ط§ظˆط² ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ", variant: "destructive" });
      return null;
    }

    if (formItemScheduledDate && Number.isNaN(new Date(`${formItemScheduledDate}T00:00:00`).getTime())) {
      toast({ title: "ط®ط·ط£", description: "طھط§ط±ظٹط® ط§ظ„ط¬ط¯ظˆظ„ط© ط؛ظٹط± طµط§ظ„ط­", variant: "destructive" });
      return null;
    }

    return { amount, paidAmount };
  };
  
  // Toggle expand project
  const toggleExpand = (projectId: string) => {
    setExpandedProject(prev => prev === projectId ? null : projectId);
  };
  
  // Share project (Web Share API)
  const shareProject = async (project: CostProject) => {
    const totals = computeProjectTotals(project);
    const text = `ظ…ط´ط±ظˆط¹: ${project.name}\nط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ: ${totals.total.toLocaleString()} ط±ظٹط§ظ„\nط§ظ„ظ…ط¯ظپظˆط¹: ${totals.totalPaid.toLocaleString()} ط±ظٹط§ظ„\nط§ظ„ظ…طھط¨ظ‚ظٹ: ${totals.totalRemaining.toLocaleString()} ط±ظٹط§ظ„`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: project.name, text });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      toast({ title: "طھظ… ظ†ط³ط® ط§ظ„ظ…ظ„ط®طµ" });
    }
  };
  
  return (
    <AppShell title="ط­ط³ط§ط¨ ط§ظ„طھظƒط§ظ„ظٹظپ" showBack>
      <div className="space-y-5 pb-6">
        
        {/* Local-only notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-2 text-xs" style={{ color: "#92400e" }}>
          <span className="font-semibold">ًں’¾ ظ…ظ„ط§ط­ط¸ط©:</span> ظ…ط­ظپظˆط¸ ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط¬ظ‡ط§ط² ظپظ‚ط·. ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظ…ط¹ ط§ظ„ط³ط­ط§ط¨ط© ظ‚ط§ط¯ظ…ط© ظ‚ط±ظٹط¨ط§ظ‹.
        </div>
        
        {/* Add Project Button */}
        <div className="flex justify-center">
          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 text-base font-bold rounded-2xl" style={{
                background: "linear-gradient(135deg, hsl(36 72% 52%), hsl(28 68% 38%))",
              }}>
                <Plus className="w-5 h-5 ml-2" />
                ظ…ط´ط±ظˆط¹ ط¬ط¯ظٹط¯
              </Button>
            </DialogTrigger>
            <DialogContent className="rtl max-w-[400px] rounded-xl">
              <DialogHeader>
                <DialogTitle>ط¥ط¶ط§ظپط© ظ…ط´ط±ظˆط¹ ط¬ط¯ظٹط¯</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>ط§ط³ظ… ط§ظ„ظ…ط´ط±ظˆط¹ *</Label>
                  <Input 
                    value={formProjectName} 
                    onChange={e => setFormProjectName(e.target.value)} 
                    placeholder="ظ…ط«ط§ظ„: طھط¬ط¯ظٹط¯ ط§ظ„ظ…ظ†ط²ظ„"
                  />
                </div>
                <Button 
                  className="w-full h-11 font-bold" 
                  onClick={handleAddProject}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„ظ…ط´ط±ظˆط¹"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Projects List */}
        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(36 72% 52%)" }} />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="font-bold text-red-600">طھط¹ط°ظ‘ط± طھط­ظ…ظٹظ„ ط§ظ„ظ…ط´ط§ط±ظٹط¹</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C9A063]/40 bg-[#FAF7F2] p-8 text-center">
            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: "#C9A063" }} />
            <h3 className="text-lg font-extrabold mb-2" style={{ color: "#2F2B25" }}>
              ظ„ط§ طھظˆط¬ط¯ ظ…ط´ط§ط±ظٹط¹
            </h3>
            <p className="text-sm font-medium" style={{ color: "#6F6557" }}>
              ط§ط¨ط¯ط£ ط¨ط¥ط¶ط§ظپط© ظ…ط´ط±ظˆط¹ ط¬ط¯ظٹط¯ ظ„طھطھط¨ط¹ طھظƒط§ظ„ظٹظپظƒ
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map(project => {
              const totals = computeProjectTotals(project);
              const isExpanded = expandedProject === project.id;
              
              return (
                <div
                  key={project.id}
                  className="rounded-2xl border bg-white/82 overflow-hidden"
                  style={{
                    borderColor: "rgba(201,160,99,0.24)",
                    boxShadow: "0 14px 34px rgba(138,107,61,0.10)",
                  }}
                >
                  {/* Project Header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpand(project.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                          background: "linear-gradient(135deg, hsl(36 72% 52% / 0.15), hsl(36 72% 52% / 0.05))",
                          border: "1px solid hsl(36 72% 52% / 0.3)",
                        }}>
                          <Calculator className="w-5 h-5" style={{ color: "#C9A063" }} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-[16px]" style={{ color: "#2F2B25" }}>
                            {project.name}
                          </h3>
                          <span className="text-xs font-medium" style={{ color: "#6F6557" }}>
                            {project.items.length} ط¨ظ†ط¯
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-left">
                          <p className="text-lg font-extrabold" style={{ color: "#8A6B3D" }}>
                            {totals.totalRemaining.toLocaleString()}
                          </p>
                          <p className="text-xs" style={{ color: "#6F6557" }}>ط±ظٹط§ظ„ ظ…طھط¨ظ‚ظٹ</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" style={{ color: "#6F6557" }} />
                        ) : (
                          <ChevronDown className="w-5 h-5" style={{ color: "#6F6557" }} />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Progress 
                        value={totals.progressPercent} 
                        className="h-2"
                        style={{
                          '--progress-background': 'linear-gradient(90deg, #C9A063, #E3C383)',
                        } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-xs mt-1" style={{ color: "#6F6557" }}>
                        <span>ط§ظ„ظ…ط¯ظپظˆط¹: {totals.totalPaid.toLocaleString()} ط±ظٹط§ظ„</span>
                        <span>ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ: {totals.total.toLocaleString()} ط±ظٹط§ظ„</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t" style={{ borderColor: "rgba(201,160,99,0.15)" }}>
                      {/* Action Buttons */}
                      <div className="flex gap-2 p-3 bg-[#FAF7F2]" style={{ borderBottom: "1px solid rgba(201,160,99,0.15)" }}>
                        <Button
                          size="sm"
                          className="h-8 text-xs font-bold flex-1"
                          onClick={() => openAddItem(project.id)}
                        >
                          <Plus className="w-3 h-3 ml-1" />
                          ط¥ط¶ط§ظپط© ط¨ظ†ط¯
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => shareProject(project)}
                        >
                          <Share2 className="w-3 h-3 ml-1" />
                          ظ…ط´ط§ط±ظƒط©
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => { setSelectedProjectId(project.id); setIsEditProjectOpen(true); openEditProject(project.id); }}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-red-500"
                          onClick={() => { setSelectedProjectId(project.id); setIsDeleteProjectOpen(true); }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Items List */}
                      {project.items.length === 0 ? (
                        <div className="p-6 text-center">
                          <p className="text-sm" style={{ color: "#6F6557" }}>
                            ظ„ط§ طھظˆط¬ط¯ ط¨ظ†ظˆط¯. ط£ط¶ظپ ط¨ظ†ط¯ط§ظ‹ ط¬ط¯ظٹط¯ط§ظ‹.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y" style={{ borderColor: "rgba(201,160,99,0.1)" }}>
                          {project.items.map(item => (
                            <div key={item.id} className="p-3 flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm" style={{ color: "#2F2B25" }}>
                                    {item.name}
                                  </h4>
                                  <span 
                                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                    style={{
                                      background: item.status === "fully_paid" ? "hsl(142 60% 90%)" : "hsl(36 72% 90%)",
                                      color: item.status === "fully_paid" ? "hsl(142 60% 40%)" : "hsl(36 72% 40%)",
                                    }}
                                  >
                                    {item.status === "fully_paid" ? "ظ…ط¯ظپظˆط¹" : item.status === "partial" ? "ط¬ط²ط¦ظٹ" : "ظ…ط¬ط¯ظˆظ„"}
                                  </span>
                                </div>
                                <p className="text-xs" style={{ color: "#6F6557" }}>
                                  {item.amount.toLocaleString()} ط±ظٹط§ظ„ â€¢ ظ…ط¯ظپظˆط¹: {item.paidAmount.toLocaleString()}
                                </p>
                                {item.scheduledDate && (
                                  <p className="text-xs" style={{ color: "#6F6557" }}>
                                    <Calendar className="w-3 h-3 inline ml-1" />
                                    {new Date(item.scheduledDate).toLocaleDateString("ar-SA")}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex gap-1">
                                {item.status !== "fully_paid" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => { setSelectedProjectId(project.id); setMarkAsPaidItemId(item.id); setIsPaidConfirmOpen(true); }}
                                  >
                                    <Check className="w-3 h-3 ml-1" />
                                    ط¯ظپط¹
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7"
                                  onClick={() => { setSelectedProjectId(project.id); openEditItem(item); }}
                                >
                                  <Edit2 className="w-3 h-3" style={{ color: "#6F6557" }} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7"
                                  onClick={() => { setSelectedProjectId(project.id); setSelectedItemId(item.id); setIsDeleteItemOpen(true); }}
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Clear All */}
                      {project.items.length > 0 && (
                        <div className="p-3 text-center" style={{ borderTop: "1px solid rgba(201,160,99,0.15)" }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-red-500"
                            onClick={() => { setSelectedProjectId(project.id); setIsClearAllOpen(true); }}
                          >
                            <Trash2 className="w-3 h-3 ml-1" />
                            ظ…ط³ط­ ط¬ظ…ظٹط¹ ط§ظ„ط¨ظ†ظˆط¯
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Edit Project Dialog */}
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="rtl max-w-[400px] rounded-xl">
            <DialogHeader>
              <DialogTitle>طھط¹ط¯ظٹظ„ ط§ظ„ظ…ط´ط±ظˆط¹</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ط§ط³ظ… ط§ظ„ظ…ط´ط±ظˆط¹ *</Label>
                <Input value={formProjectName} onChange={e => setFormProjectName(e.target.value)} />
              </div>
              <Button className="w-full h-11 font-bold" onClick={handleEditProject} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Add Item Dialog */}
        <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
          <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>ط¥ط¶ط§ظپط© ط¨ظ†ط¯ ط¬ط¯ظٹط¯</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ط§ط³ظ… ط§ظ„ط¨ظ†ط¯ *</Label>
                <Input value={formItemName} onChange={e => setFormItemName(e.target.value)} placeholder="ظ…ط«ط§ظ„: ط£ط«ط§ط«" />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ *</Label>
                <Input type="number" value={formItemAmount} onChange={e => setFormItemAmount(e.target.value)} placeholder="10000" />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹</Label>
                <Input type="number" value={formItemPaidAmount} onChange={e => setFormItemPaidAmount(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>طھط§ط±ظٹط® ظ…ط¬ط¯ظˆظ„ (ط§ط®طھظٹط§ط±ظٹ)</Label>
                <Input type="date" value={formItemScheduledDate} onChange={e => setFormItemScheduledDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ظ…ظ„ط§ط­ط¸ط§طھ</Label>
                <Textarea value={formItemNotes} onChange={e => setFormItemNotes(e.target.value)} rows={2} />
              </div>
              <Button className="w-full h-11 font-bold" onClick={handleAddItem} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط¥ط¶ط§ظپط© ط§ظ„ط¨ظ†ط¯"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Item Dialog */}
        <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
          <DialogContent className="rtl max-w-[400px] rounded-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>طھط¹ط¯ظٹظ„ ط§ظ„ط¨ظ†ط¯</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ط§ط³ظ… ط§ظ„ط¨ظ†ط¯ *</Label>
                <Input value={formItemName} onChange={e => setFormItemName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ *</Label>
                <Input type="number" value={formItemAmount} onChange={e => setFormItemAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظ…ط¯ظپظˆط¹</Label>
                <Input type="number" value={formItemPaidAmount} onChange={e => setFormItemPaidAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>طھط§ط±ظٹط® ظ…ط¬ط¯ظˆظ„</Label>
                <Input type="date" value={formItemScheduledDate} onChange={e => setFormItemScheduledDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ظ…ظ„ط§ط­ط¸ط§طھ</Label>
                <Textarea value={formItemNotes} onChange={e => setFormItemNotes(e.target.value)} rows={2} />
              </div>
              <Button className="w-full h-11 font-bold" onClick={handleEditItem} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "ط­ظپط¸ ط§ظ„طھط¹ط¯ظٹظ„ط§طھ"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Confirm Dialogs */}
        <ConfirmDialog
          open={isDeleteProjectOpen}
          onOpenChange={setIsDeleteProjectOpen}
          title="ط­ط°ظپ ط§ظ„ظ…ط´ط±ظˆط¹"
          description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ‡ط°ط§ ط§ظ„ظ…ط´ط±ظˆط¹ ظˆط¬ظ…ظٹط¹ ط§ظ„ط¨ظ†ظˆط¯طں"
          confirmText="ط­ط°ظپ"
          onConfirm={handleDeleteProject}
          destructive
        />
        
        <ConfirmDialog
          open={isDeleteItemOpen}
          onOpenChange={setIsDeleteItemOpen}
          title="ط­ط°ظپ ط§ظ„ط¨ظ†ط¯"
          description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ط­ط°ظپ ظ‡ط°ط§ ط§ظ„ط¨ظ†ط¯طں"
          confirmText="ط­ط°ظپ"
          onConfirm={handleDeleteItem}
          destructive
        />
        
        <ConfirmDialog
          open={isClearAllOpen}
          onOpenChange={setIsClearAllOpen}
          title="ظ…ط³ط­ ط¬ظ…ظٹط¹ ط§ظ„ط¨ظ†ظˆط¯"
          description="ظ‡ظ„ ط£ظ†طھ ظ…طھط£ظƒط¯ ظ…ظ† ظ…ط³ط­ ط¬ظ…ظٹط¹ ط§ظ„ط¨ظ†ظˆط¯ ظپظٹ ظ‡ط°ط§ ط§ظ„ظ…ط´ط±ظˆط¹طں"
          confirmText="ظ…ط³ط­ ط§ظ„ظƒظ„"
          onConfirm={handleClearAllItems}
          destructive
        />
        
        <Dialog open={isPaidConfirmOpen} onOpenChange={setIsPaidConfirmOpen}>
          <DialogContent className="rtl max-w-[350px] rounded-xl">
            <DialogHeader>
              <DialogTitle>طھط£ظƒظٹط¯ ط§ظ„ط¯ظپط¹</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm" style={{ color: "#6F6557" }}>
                ظƒظٹظپ طھط±ظٹط¯ طھط³ط¬ظٹظ„ ط§ظ„ط¯ظپط¹طں
              </p>
              <div className="space-y-2">
                <Button
                  className="w-full h-11 font-bold"
                  onClick={() => handleMarkAsPaid(true)}
                >
                  <Coins className="w-4 h-4 ml-2" />
                  ط¯ظپط¹ظ„ ط§ظ„ظ…ط¨ظ„ط؛ ط§ظ„ظƒط§ظ…ظ„
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => handleMarkAsPaid(false)}
                >
                  ط®طµظ… ط§ظ„ظ…طھط¨ظ‚ظٹ ظ…ظ† ط§ظ„ظ…ط¬ظ…ظˆط¹
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
      </div>
    </AppShell>
  );
}

