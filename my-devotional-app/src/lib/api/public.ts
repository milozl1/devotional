import { supabase } from '../supabase';
import type { CompletedSteps, Devotional, Journal, UserProgress } from '../../types';
import { getDeviceId } from '../utils';
import {
  cachedDevotionals,
  cachedDevotionalByDay,
  cachedProgress,
  cachedJournals,
  cachedJournalBySlug,
  invalidateProgress,
} from '../cache';

const DEFAULT_STEPS: CompletedSteps = {
  passage: false,
  textQuestions: false,
  meditation: false,
  prayer: false,
};

// ─── Journals ──────────────────────────────

async function _fetchActiveJournals(): Promise<Journal[]> {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  // Get counts per journal
  const journals: Journal[] = data || [];
  for (const j of journals) {
    const { count } = await supabase
      .from('devotionals')
      .select('*', { count: 'exact', head: true })
      .eq('journal_id', j.id)
      .eq('is_published', true);
    j.published_count = count ?? 0;
  }

  return journals;
}

export function getActiveJournals(): Promise<Journal[]> {
  return cachedJournals(_fetchActiveJournals);
}

async function _fetchJournalBySlug(slug: string): Promise<Journal | null> {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function getJournalBySlug(slug: string): Promise<Journal | null> {
  return cachedJournalBySlug(slug, () => _fetchJournalBySlug(slug));
}

// ─── Devotionals ───────────────────────────

async function _fetchPublishedDevotionals(journalId: string): Promise<Devotional[]> {
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .eq('journal_id', journalId)
    .eq('is_published', true)
    .order('day_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

export function getPublishedDevotionals(journalId: string): Promise<Devotional[]> {
  return cachedDevotionals(journalId, () => _fetchPublishedDevotionals(journalId));
}

async function _fetchDevotionalByDay(journalId: string, dayNumber: number): Promise<Devotional | null> {
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .eq('journal_id', journalId)
    .eq('day_number', dayNumber)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function getDevotionalByDay(journalId: string, dayNumber: number): Promise<Devotional | null> {
  return cachedDevotionalByDay(journalId, dayNumber, () => _fetchDevotionalByDay(journalId, dayNumber));
}

// ─── User Progress ─────────────────────────

export async function getUserProgress(devotionalId: string): Promise<UserProgress | null> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('device_id', deviceId)
    .eq('devotional_id', devotionalId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function _fetchAllUserProgress(): Promise<UserProgress[]> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('device_id', deviceId);

  if (error) throw error;
  return data || [];
}

export function getAllUserProgress(): Promise<UserProgress[]> {
  const deviceId = getDeviceId();
  return cachedProgress(deviceId, _fetchAllUserProgress);
}

export async function updateStepProgress(
  devotionalId: string,
  step: keyof CompletedSteps,
  value: boolean
): Promise<UserProgress> {
  const deviceId = getDeviceId();
  const existingProgress = await getUserProgress(devotionalId);

  if (!existingProgress) {
    const newSteps: CompletedSteps = { ...DEFAULT_STEPS, [step]: value };
    const allDone = Object.values(newSteps).every(Boolean);

    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        device_id: deviceId,
        devotional_id: devotionalId,
        completed_steps: newSteps,
        is_completed: allDone,
        completed_at: allDone ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    await invalidateProgress(deviceId);
    return data;
  }

  const updatedSteps = { ...existingProgress.completed_steps, [step]: value };
  const allDone = Object.values(updatedSteps).every(Boolean);

  const { data, error } = await supabase
    .from('user_progress')
    .update({
      completed_steps: updatedSteps,
      is_completed: allDone,
      completed_at: allDone ? new Date().toISOString() : null,
    })
    .eq('id', existingProgress.id)
    .select()
    .single();

  if (error) throw error;
  await invalidateProgress(deviceId);
  return data;
}
