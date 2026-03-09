import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  LogOut,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { getAllDevotionals, deleteDevotional, togglePublish } from '../../lib/api/admin';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatShortDate, cn } from '../../lib/utils';
import type { Devotional } from '../../types';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const fetchDevotionals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllDevotionals();
      setDevotionals(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Eroare la încărcare');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevotionals();
  }, [fetchDevotionals]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi "${title}"?`)) return;
    try {
      await deleteDevotional(id);
      toast.success('Devotional șters');
      fetchDevotionals();
    } catch {
      toast.error('Eroare la ștergere');
    }
    setOpenMenu(null);
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await togglePublish(id, !current);
      toast.success(current ? 'Devotional ascuns' : 'Devotional publicat');
      fetchDevotionals();
    } catch {
      toast.error('Eroare la actualizare');
    }
    setOpenMenu(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const filtered = devotionals.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.bible_passage_reference.toLowerCase().includes(search.toLowerCase()) ||
      d.day_number.toString().includes(search)
  );

  const publishedCount = devotionals.filter((d) => d.is_published).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Deconectare
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{devotionals.length}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#1e3a5f]">{publishedCount}</p>
            <p className="text-xs text-slate-400">Publicate</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#d4a843]">{devotionals.length - publishedCount}</p>
            <p className="text-xs text-slate-400">Ciorne</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută devotional..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40 focus:border-transparent bg-white"
            />
          </div>
          <Button variant="primary" onClick={() => navigate('/admin/devotional/new')}>
            <Plus className="w-4 h-4" />
            Adaugă
          </Button>
        </div>

        {/* Devotional list */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            {filtered.map((devotional) => (
              <div
                key={devotional.id}
                className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4"
              >
                {/* Day badge */}
                <div
                  className={cn(
                    'w-11 h-11 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm',
                    devotional.is_published
                      ? 'bg-[#1e3a5f]/10 text-[#1e3a5f]'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {devotional.day_number}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{devotional.title}</h3>
                  <p className="text-xs text-slate-400 truncate">
                    {devotional.bible_passage_reference} · {formatShortDate(devotional.date)}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0',
                    devotional.is_published
                      ? 'bg-[#1e3a5f]/10 text-[#1e3a5f]'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {devotional.is_published ? 'Publicat' : 'Ciornă'}
                </span>

                {/* Actions menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === devotional.id ? null : devotional.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openMenu === devotional.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-20 min-w-[160px]">
                        <button
                          onClick={() => {
                            navigate(`/admin/devotional/${devotional.id}`);
                            setOpenMenu(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Editează
                        </button>
                        <button
                          onClick={() => handleTogglePublish(devotional.id, devotional.is_published)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
                        >
                          {devotional.is_published ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              Ascunde
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              Publică
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(devotional.id, devotional.title)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Șterge
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">Niciun devotional găsit</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
