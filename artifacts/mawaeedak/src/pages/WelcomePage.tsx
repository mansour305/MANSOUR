import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/hooks/useStore";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useListThemes } from "@api-client";
import type { Theme } from "@api-client";

const CITIES = [
  "ط§ظ„ط±ظٹط§ط¶", "ط¬ط¯ط©", "ظ…ظƒط© ط§ظ„ظ…ظƒط±ظ…ط©", "ط§ظ„ظ…ط¯ظٹظ†ط© ط§ظ„ظ…ظ†ظˆط±ط©", "ط§ظ„ط¯ظ…ط§ظ…", 
  "ط£ط¨ظ‡ط§", "طھط¨ظˆظƒ", "ط§ظ„ظ‚طµظٹظ…", "ط­ط§ط¦ظ„", "ط§ظ„ط¬ظˆظپ"
];

const INTERESTS = [
  { id: "salary", label: "ط§ظ„ط±ظˆط§طھط¨" },
  { id: "citizen", label: "ط­ط³ط§ط¨ ط§ظ„ظ…ظˆط§ط·ظ†" },
  { id: "support", label: "ط§ظ„ط¶ظ…ط§ظ† ط§ظ„ظ…ط·ظˆط±" },
  { id: "housing", label: "ط§ظ„ط¯ط¹ظ… ط§ظ„ط³ظƒظ†ظٹ" },
  { id: "retirement", label: "ط§ظ„طھظ‚ط§ط¹ط¯" },
  { id: "insurance", label: "ط§ظ„طھط£ظ…ظٹظ†ط§طھ" },
  { id: "jobs", label: "ط§ظ„ظˆط¸ط§ط¦ظپ ظˆط§ظ„ط£ط®ط¨ط§ط±" },
  { id: "prayers", label: "ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©" },
  { id: "study", label: "ط§ظ„ط¯ط±ط§ط³ط© ظˆط§ظ„ط¥ط¬ط§ط²ط§طھ" },
];

export default function WelcomePage() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { user, setUser } = useStore();
  const { changeTheme } = useTheme();
  
  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "ط§ظ„ط±ظٹط§ط¶");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  
  const { data: themes } = useListThemes();
  // Normalize themes response: API may return an array or an object { data: [] }.
  // Protect against unexpected shapes so `.map` won't throw at runtime.
  const normalizedThemes: Theme[] = Array.isArray(themes)
    ? themes
    : (themes && typeof themes === "object" && Array.isArray((themes as any).data))
      ? (themes as any).data
      : [];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setUser({
        name,
        city,
        interests: selectedInterests,
        onboardingComplete: true
      });
      setLocation("/");
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col max-w-[480px] mx-auto app-frame">
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 mt-4">
          <div className="text-xl font-bold text-primary">ظ…ظˆط§ط¹ظٹط¯ظƒ</div>
          <div className="text-sm font-medium text-muted-foreground">ط®ط·ظˆط© {step} ظ…ظ† 3</div>
        </div>

        {step === 1 && (
          <div className="flex-1 animate-in slide-in-from-right-4 fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 leading-tight">ط£ظ‡ظ„ط§ظ‹ ط¨ظƒ ظپظٹ ظ…ظ†طµطھظƒ ط§ظ„ط´ط®طµظٹط©</h1>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              ط¯ظژط¹ظ†ط§ ظ†طھط¹ط±ظپ ط¹ظ„ظٹظƒ ظ„ظ†ظ‚ط¯ظ… ظ„ظƒ طھط¬ط±ط¨ط© ظ…ط®طµطµط© طھظˆط§ظƒط¨ ظٹظˆظ…ظƒ ظˆظ…ظˆط§ط¹ظٹط¯ظƒ.
            </p>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base">ط§ظ„ط§ط³ظ… ط£ظˆ ط§ظ„ظ„ظ‚ط¨</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="ظƒظٹظپ طھط­ط¨ ط£ظ† ظ†ظ†ط§ط¯ظٹظƒطں" 
                  className="h-14 text-lg rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="city" className="text-base">ظ…ط¯ظٹظ†طھظƒ</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-14 text-lg rounded-xl">
                    <SelectValue placeholder="ط§ط®طھط± ظ…ط¯ظٹظ†طھظƒ" />
                  </SelectTrigger>
                  <SelectContent className="rtl">
                    {CITIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">طھط³طھط®ط¯ظ… ظ„ط­ط³ط§ط¨ ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© ط¨ط¯ظ‚ط©.</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 animate-in slide-in-from-right-4 fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 leading-tight">ظ…ط§ ظ‡ظٹ ط§ظ‡طھظ…ط§ظ…ط§طھظƒطں</h1>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              ط§ط®طھط± ط§ظ„ظ…ظˆط§ط¶ظٹط¹ ط§ظ„طھظٹ طھظ‡ظ…ظƒ ظ„طھط®طµظٹطµ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظˆط§ظ„ظ…ط­طھظˆظ‰.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map(interest => (
                <div 
                  key={interest.id}
                  className={cn(
                    "flex items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    selectedInterests.includes(interest.id) 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border hover:border-border/80"
                  )}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <Checkbox 
                    id={interest.id} 
                    checked={selectedInterests.includes(interest.id)} 
                    onCheckedChange={() => toggleInterest(interest.id)}
                    className="pointer-events-none"
                  />
                  <Label htmlFor={interest.id} className="text-base pointer-events-none cursor-pointer flex-1 font-medium">
                    {interest.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 animate-in slide-in-from-right-4 fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-4 leading-tight">ط§ط®طھط± ظ…ط¸ظ‡ط± ظ…ظ†طµطھظƒ</h1>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              ط§ط®طھط± ط§ظ„ط«ظٹظ… ط§ظ„ط°ظٹ ظٹط¹ظƒط³ ط°ظˆظ‚ظƒ (ظٹظ…ظƒظ†ظƒ طھط؛ظٹظٹط±ظ‡ ظ„ط§ط­ظ‚ط§ظ‹).
            </p>

            <div className="space-y-4">
              {normalizedThemes.map((theme) => (
                <Card 
                  key={theme.slug} 
                  className="p-4 cursor-pointer hover:border-primary transition-colors border-2 group"
                  onClick={() => changeTheme(theme.slug)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{theme.name}</h3>
                      {theme.description && <p className="text-sm text-muted-foreground">{theme.description}</p>}
                    </div>
                    <div className="flex gap-1.5 rtl:flex-row-reverse">
                      {theme.colors && Object.entries(theme.colors as Record<string, string>).slice(0, 3).map(([key, val]) => (
                        <div 
                          key={key} 
                          className="w-6 h-6 rounded-full border shadow-sm" 
                          style={{ backgroundColor: String(val) }}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-card border-t border-border flex justify-between gap-4">
        {step > 1 ? (
          <Button variant="outline" className="h-14 px-6 rounded-xl shrink-0" onClick={handlePrev}>
            <ArrowRight className="w-5 h-5 ml-2" />
            ط§ظ„ط³ط§ط¨ظ‚
          </Button>
        ) : <div className="w-[100px]" />}
        
        <Button className="h-14 flex-1 text-lg font-bold rounded-xl" onClick={handleNext}>
          {step === 3 ? "ط§ط¨ط¯ط£ طھط¬ط±ط¨طھظƒ" : "ط§ظ„طھط§ظ„ظٹ"}
          {step < 3 && <ArrowLeft className="w-5 h-5 mr-2" />}
        </Button>
      </div>
    </div>
  );
}

