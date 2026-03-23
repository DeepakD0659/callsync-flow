import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WizardStep {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  validate?: () => boolean;
}

interface WizardProps {
  steps: WizardStep[];
  onComplete?: () => void;
  className?: string;
}

export function Wizard({ steps, onComplete, className }: WizardProps) {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const goNext = () => {
    const step = steps[current];
    if (step.validate && !step.validate()) return;
    setCompleted((prev) => new Set(prev).add(current));
    if (current < steps.length - 1) setCurrent(current + 1);
    else onComplete?.();
  };

  const goBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => i < current && setCurrent(i)}
              className={cn(
                "flex items-center gap-2 transition-all",
                i < current && "cursor-pointer",
                i > current && "cursor-default opacity-50"
              )}
            >
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                i === current && "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/25",
                i < current || completed.has(i)
                  ? "border-success bg-success text-success-foreground"
                  : i > current && "border-border bg-card text-muted-foreground"
              )}>
                {completed.has(i) && i !== current ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:inline",
                i === current ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-3 rounded-full transition-colors",
                i < current ? "bg-success" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content with transition */}
      <div className="animate-in-up" key={current}>
        {steps[current].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="outline" onClick={goBack} disabled={current === 0}>
          Previous Step
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Step {current + 1} of {steps.length}
          </span>
          <Button onClick={goNext}>
            {current === steps.length - 1 ? "Complete" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
