import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DevotionalStep, CompletedSteps } from '../../types';
import { DEVOTIONAL_STEPS } from '../../types';

interface StepperProps {
  currentStep: number;
  completedSteps: CompletedSteps;
  onStepClick: (index: number) => void;
}

export function Stepper({ currentStep, completedSteps, onStepClick }: StepperProps) {
  const isCompleted = (step: DevotionalStep) => completedSteps[step];

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {DEVOTIONAL_STEPS.map((step, index) => {
        const completed = isCompleted(step.key);
        const active = currentStep === index;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 shrink-0',
                completed && 'bg-[#d4a843] text-white shadow-md shadow-[#d4a843]/30',
                active && !completed && 'bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/30 ring-4 ring-[#1e3a5f]/15',
                !active && !completed && 'bg-slate-100 text-slate-400'
              )}
            >
              {completed ? <Check className="w-5 h-5" /> : index + 1}
            </button>

            {/* Connector line */}
            {index < DEVOTIONAL_STEPS.length - 1 && (
              <div className="flex-1 mx-2">
                <div
                  className={cn(
                    'h-0.5 rounded-full transition-all duration-500',
                    completed ? 'bg-[#d4a843]/60' : 'bg-slate-200'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Step labels shown below stepper
export function StepLabels({ currentStep }: { currentStep: number }) {
  return (
    <div className="text-center pb-2">
      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
        Pasul {currentStep + 1} din {DEVOTIONAL_STEPS.length}
      </p>
      <h3 className="text-sm font-semibold text-slate-700 mt-0.5">
        {DEVOTIONAL_STEPS[currentStep]?.label}
      </h3>
    </div>
  );
}
