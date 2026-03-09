import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, BookOpen } from 'lucide-react';
import { cn, formatShortDate } from '../../lib/utils';
import type { Devotional, UserProgress } from '../../types';

interface DevotionalCardProps {
  devotional: Devotional;
  progress?: UserProgress;
  journalSlug: string;
}

export function DevotionalCard({ devotional, progress, journalSlug }: DevotionalCardProps) {
  const navigate = useNavigate();
  const isCompleted = progress?.is_completed ?? false;
  const completedCount = progress
    ? Object.values(progress.completed_steps).filter(Boolean).length
    : 0;

  return (
    <button
      onClick={() => navigate(`/jurnal/${journalSlug}/ziua/${devotional.day_number}`)}
      className={cn(
        'w-full text-left p-4 rounded-2xl border transition-all duration-200 group',
        'hover:shadow-md active:scale-[0.98]',
        isCompleted
          ? 'bg-[#d4a843]/10 border-[#d4a843]/30 hover:border-[#d4a843]/50'
          : 'bg-white border-slate-150 hover:border-slate-300'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Day number badge */}
        <div
          className={cn(
            'w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0',
            isCompleted ? 'bg-[#d4a843] text-white' : 'bg-[#1e3a5f]/10 text-[#1e3a5f]'
          )}
        >
          {isCompleted ? (
            <Check className="w-6 h-6" />
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">Ziua</span>
              <span className="text-lg font-bold -mt-0.5">{devotional.day_number}</span>
            </>
          )}
        </div>

        {/* Content */}
          <div className="flex-1 min-w-0">
          <div className="mb-0.5">
            <h3 className="font-semibold text-slate-800 text-[15px] leading-snug">{devotional.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <BookOpen className="w-3 h-3" />
            <span>{devotional.bible_passage_reference}</span>
            <span>·</span>
            <span>{formatShortDate(devotional.date)}</span>
          </div>

          {/* Progress bar */}
          {completedCount > 0 && !isCompleted && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#d4a843] transition-all duration-500"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{completedCount}/4</span>
            </div>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
      </div>
    </button>
  );
}
