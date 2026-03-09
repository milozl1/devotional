import { BookOpen, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDevotionals, useAllProgress } from '../hooks/useDevotional';
import { DevotionalCard } from '../components/devotional/DevotionalCard';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  const { devotionals, loading, error, refetch } = useDevotionals();
  const { progressMap } = useAllProgress();
  const navigate = useNavigate();

  // Find the next incomplete devotional
  const nextDevotional = devotionals.find((d) => {
    const progress = progressMap[d.id];
    return !progress?.is_completed;
  });

  const completedCount = devotionals.filter((d) => progressMap[d.id]?.is_completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-[#1e3a5f] via-[#2a4d7a] to-[#152d4a]">
          <div className="max-w-lg mx-auto px-5 pt-12 pb-8">
            <div className="skeleton h-10 w-48 mb-4" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
        <div className="max-w-lg mx-auto px-5 py-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e3a5f] via-[#2a4d7a] to-[#152d4a] text-white">
        <div className="max-w-lg mx-auto px-5 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Biserica Impact Timișoara</h1>
              <p className="text-[#e8c76b] text-xs font-medium">Jurnal Devoțional — Epistola lui Iacov</p>
            </div>
          </div>

          {/* Progress overview */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-200">Progresul tău</span>
              <span className="text-sm font-bold text-[#e8c76b]">
                {completedCount}/{devotionals.length} zile
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#d4a843] transition-all duration-700"
                style={{
                  width: devotionals.length ? `${(completedCount / devotionals.length) * 100}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Continue reading CTA */}
      <div className="max-w-lg mx-auto px-5 -mt-4">
        {nextDevotional && (
          <button
            onClick={() => navigate(`/ziua/${nextDevotional.day_number}`)}
            className="w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-4 flex items-center gap-4 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-[#1e3a5f]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-[#d4a843] font-semibold uppercase tracking-wider">
                Continuă citirea
              </p>
              <p className="font-bold text-slate-800 mt-0.5">
                Ziua {nextDevotional.day_number}: {nextDevotional.title}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
          </button>
        )}
      </div>

      {/* Devotional list */}
      <div className="max-w-lg mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Toate zilele</h2>
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="w-3.5 h-3.5" />
            Reîncarcă
          </Button>
        </div>

        <div className="space-y-3">
          {devotionals.map((devotional, index) => (
            <div key={devotional.id} className={`animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}>
              <DevotionalCard
                devotional={devotional}
                progress={progressMap[devotional.id]}
              />
            </div>
          ))}
        </div>

        {devotionals.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Niciun devoțional disponibil</p>
            <p className="text-slate-400 text-sm mt-1">Revino curând!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-lg mx-auto px-5 pb-8 pt-4 text-center border-t border-slate-100 mt-4">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Biserica Impact Timișoara
        </p>
        <p className="text-[10px] text-slate-300 mt-1">
          Jurnal Devoțional — Epistola lui Iacov
        </p>
      </footer>
    </div>
  );
}
