import { BookOpen, ChevronRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJournals } from '../hooks/useDevotional';
import { ErrorState } from '../components/ui/ErrorState';

export default function HomePage() {
  const { journals, loading, error, refetch } = useJournals();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-[#1e3a5f] via-[#2a4d7a] to-[#152d4a]">
          <div className="max-w-lg mx-auto px-5 pt-12 pb-10">
            <div className="skeleton h-10 w-48 mb-4" />
            <div className="skeleton h-6 w-64" />
          </div>
        </div>
        <div className="max-w-lg mx-auto px-5 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 w-full rounded-2xl" />
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
        <div className="max-w-lg mx-auto px-5 pt-12 pb-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Biserica Impact Timișoara</h1>
                <p className="text-[#e8c76b] text-xs font-medium">Jurnale Devoționale</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/instaleaza')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl px-3 py-2 transition-all duration-200 text-white/80 hover:text-white shrink-0 mt-0.5"
              title="Instalează aplicația"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Instalează</span>
            </button>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Alege un jurnal devoțional pentru a începe sau continua studiul biblic zilnic.
          </p>
        </div>
      </div>

      {/* Journal cards */}
      <div className="max-w-lg mx-auto px-5 py-6 -mt-4">
        <div className="space-y-4">
          {journals.map((journal, index) => (
            <button
              key={journal.id}
              onClick={() => navigate(`/jurnal/${journal.slug}`)}
              className={`w-full text-left rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-200 active:scale-[0.98] overflow-hidden animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
            >
              <div className="p-5 flex items-center gap-4">
                {/* Emoji cover */}
                <div className="w-16 h-16 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                  <span className="text-3xl">{journal.cover_emoji}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 text-base leading-snug break-words">
                    {journal.title}
                  </h2>
                  {journal.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{journal.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-[#d4a843] font-semibold">
                      {journal.published_count ?? 0} zile
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
              </div>
            </button>
          ))}

          {journals.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Niciun jurnal disponibil</p>
              <p className="text-slate-400 text-sm mt-1">Revino curând!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-lg mx-auto px-5 pb-8 pt-4 text-center border-t border-slate-100 mt-4">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Biserica Impact Timișoara
        </p>
      </footer>
    </div>
  );
}
