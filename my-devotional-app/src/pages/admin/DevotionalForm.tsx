import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Save, Eye } from 'lucide-react';
import { createDevotional, updateDevotional, getDevotionalById } from '../../lib/api/admin';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { DevotionalFormData } from '../../types';
import toast from 'react-hot-toast';

const emptyForm: DevotionalFormData = {
  journal_id: '',
  day_number: 1,
  title: '',
  date: new Date().toISOString().split('T')[0],
  bible_passage_reference: '',
  bible_passage_text: '',
  text_questions: [''],
  meditation_questions: [''],
  prayer_text: '',
  is_published: false,
};

export default function DevotionalForm() {
  const { journalId, id } = useParams<{ journalId: string; id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [form, setForm] = useState<DevotionalFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDevotional = useCallback(async () => {
    if (!isEditing) return;
    try {
      setLoading(true);
      const data = await getDevotionalById(id!);
      if (data) {
        setForm({
          journal_id: data.journal_id,
          day_number: data.day_number,
          title: data.title,
          date: data.date,
          bible_passage_reference: data.bible_passage_reference,
          bible_passage_text: data.bible_passage_text,
          text_questions: data.text_questions.length ? data.text_questions : [''],
          meditation_questions: data.meditation_questions.length ? data.meditation_questions : [''],
          prayer_text: data.prayer_text,
          is_published: data.is_published,
        });
      }
    } catch {
      toast.error('Eroare la încărcarea devotionalului');
    } finally {
      setLoading(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    fetchDevotional();
  }, [fetchDevotional]);

  const updateField = <K extends keyof DevotionalFormData>(key: K, value: DevotionalFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateQuestion = (type: 'text_questions' | 'meditation_questions', index: number, value: string) => {
    setForm((prev) => {
      const questions = [...prev[type]];
      questions[index] = value;
      return { ...prev, [type]: questions };
    });
  };

  const addQuestion = (type: 'text_questions' | 'meditation_questions') => {
    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], ''],
    }));
  };

  const removeQuestion = (type: 'text_questions' | 'meditation_questions', index: number) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (publish?: boolean) => {
    // Validation
    if (!form.title.trim()) return toast.error('Titlul este obligatoriu');
    if (!form.bible_passage_reference.trim()) return toast.error('Referința biblică este obligatorie');
    if (!form.bible_passage_text.trim()) return toast.error('Textul pasajului este obligatoriu');
    if (form.text_questions.some((q) => !q.trim())) return toast.error('Completează toate întrebările din text');
    if (form.meditation_questions.some((q) => !q.trim())) return toast.error('Completează toate întrebările de meditație');
    if (!form.prayer_text.trim()) return toast.error('Textul rugăciunii este obligatoriu');

    const data: DevotionalFormData = {
      ...form,
      journal_id: journalId!,
      text_questions: form.text_questions.filter((q) => q.trim()),
      meditation_questions: form.meditation_questions.filter((q) => q.trim()),
      is_published: publish !== undefined ? publish : form.is_published,
    };

    try {
      setSaving(true);
      if (isEditing) {
        await updateDevotional(id!, data);
        toast.success('Devotional actualizat!');
      } else {
        await createDevotional(data);
        toast.success('Devotional creat!');
      }
      navigate(`/admin/jurnal/${journalId}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Eroare la salvare');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(`/admin/jurnal/${journalId}`)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <span className="text-sm font-bold text-slate-800">
            {isEditing ? 'Editează devotional' : 'Devotional nou'}
          </span>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6">
        <div className="space-y-6">
          {/* Basic info */}
          <section className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h2 className="font-bold text-slate-800">Informații de bază</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Ziua</label>
                <input
                  type="number"
                  min={1}
                  value={form.day_number}
                  onChange={(e) => updateField('day_number', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Data</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Titlul devotionalului</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex: Pacea lui Dumnezeu"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40"
              />
            </div>
          </section>

          {/* Bible passage */}
          <section className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h2 className="font-bold text-slate-800">📖 Pasaj Biblic</h2>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Referința (ex: Filipeni 4:6-7)</label>
              <input
                type="text"
                value={form.bible_passage_reference}
                onChange={(e) => updateField('bible_passage_reference', e.target.value)}
                placeholder="Carte capitolul:versetele"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Textul pasajului</label>
              <textarea
                value={form.bible_passage_text}
                onChange={(e) => updateField('bible_passage_text', e.target.value)}
                rows={5}
                placeholder="Copiază textul biblic aici..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40 resize-none"
              />
            </div>
          </section>

          {/* Text questions */}
          <section className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">❓ Întrebări din Text</h2>
              <Button variant="ghost" size="sm" onClick={() => addQuestion('text_questions')}>
                <Plus className="w-3.5 h-3.5" />
                Adaugă
              </Button>
            </div>

            {form.text_questions.map((q, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center text-xs font-bold mt-1.5">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => updateQuestion('text_questions', i, e.target.value)}
                  placeholder={`Întrebarea ${i + 1}...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40"
                />
                {form.text_questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion('text_questions', i)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Meditation questions */}
          <section className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">💜 Întrebări de Meditație</h2>
              <Button variant="ghost" size="sm" onClick={() => addQuestion('meditation_questions')}>
                <Plus className="w-3.5 h-3.5" />
                Adaugă
              </Button>
            </div>

            {form.meditation_questions.map((q, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#d4a843]/15 text-[#d4a843] flex items-center justify-center text-xs font-bold mt-1.5">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => updateQuestion('meditation_questions', i, e.target.value)}
                  placeholder={`Întrebarea ${i + 1}...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40"
                />
                {form.meditation_questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion('meditation_questions', i)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Prayer */}
          <section className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h2 className="font-bold text-slate-800">🙏 Rugăciune</h2>
            <textarea
              value={form.prayer_text}
              onChange={(e) => updateField('prayer_text', e.target.value)}
              rows={4}
              placeholder="Scrie textul rugăciunii..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/40 resize-none"
            />
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              loading={saving}
              onClick={() => handleSubmit(false)}
            >
              <Save className="w-4 h-4" />
              Salvează ca ciornă
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              loading={saving}
              onClick={() => handleSubmit(true)}
            >
              <Eye className="w-4 h-4" />
              Salvează și publică
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
