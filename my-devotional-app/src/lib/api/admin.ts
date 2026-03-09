import { supabase } from '../supabase';
import type { AdminProfile, Devotional, DevotionalFormData, Journal, JournalFormData } from '../../types';
import { invalidateDevotionals, invalidateJournals } from '../cache';

// ─── Admin Profile ─────────────────────────

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ─── Journals ──────────────────────────────

export async function getAllJournals(): Promise<Journal[]> {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  const journals: Journal[] = data || [];

  // Get devotional counts per journal
  for (const j of journals) {
    const { count: total } = await supabase
      .from('devotionals')
      .select('*', { count: 'exact', head: true })
      .eq('journal_id', j.id);
    const { count: published } = await supabase
      .from('devotionals')
      .select('*', { count: 'exact', head: true })
      .eq('journal_id', j.id)
      .eq('is_published', true);
    j.devotional_count = total ?? 0;
    j.published_count = published ?? 0;
  }

  return journals;
}

export async function getJournalById(id: string): Promise<Journal | null> {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createJournal(journal: JournalFormData): Promise<Journal> {
  const { data, error } = await supabase
    .from('journals')
    .insert(journal)
    .select()
    .single();

  if (error) throw error;
  await invalidateJournals();
  return data;
}

export async function updateJournal(id: string, journal: Partial<JournalFormData>): Promise<Journal> {
  const { data, error } = await supabase
    .from('journals')
    .update(journal)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  await invalidateJournals();
  return data;
}

export async function deleteJournal(id: string): Promise<void> {
  const { error } = await supabase.from('journals').delete().eq('id', id);
  if (error) throw error;
  await invalidateJournals();
  await invalidateDevotionals();
}

export async function toggleJournalActive(id: string, isActive: boolean): Promise<Journal> {
  return updateJournal(id, { is_active: isActive } as Partial<JournalFormData>);
}

// ─── Devotionals ───────────────────────────

export async function getAllDevotionals(journalId?: string): Promise<Devotional[]> {
  let query = supabase
    .from('devotionals')
    .select('*')
    .order('day_number', { ascending: true });

  if (journalId) {
    query = query.eq('journal_id', journalId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getDevotionalById(id: string): Promise<Devotional | null> {
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createDevotional(devotional: DevotionalFormData): Promise<Devotional> {
  const { data, error } = await supabase
    .from('devotionals')
    .insert(devotional)
    .select()
    .single();

  if (error) throw error;
  await invalidateDevotionals();
  return data;
}

export async function updateDevotional(
  id: string,
  devotional: Partial<DevotionalFormData>
): Promise<Devotional> {
  const { data, error } = await supabase
    .from('devotionals')
    .update(devotional)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  await invalidateDevotionals();
  return data;
}

export async function deleteDevotional(id: string): Promise<void> {
  const { error } = await supabase.from('devotionals').delete().eq('id', id);
  if (error) throw error;
  await invalidateDevotionals();
}

export async function togglePublish(id: string, isPublished: boolean): Promise<Devotional> {
  return updateDevotional(id, { is_published: isPublished } as Partial<DevotionalFormData>);
}
