import { supabase } from '../supabase';
import type { CompletedSteps, Devotional, UserProgress } from '../../types';
import { getDeviceId } from '../utils';
import {
  cachedDevotionals,
  cachedDevotionalByDay,
  cachedProgress,
  invalidateProgress,
} from '../cache';

const DEFAULT_STEPS: CompletedSteps = {
  passage: false,
  textQuestions: false,
  meditation: false,
  prayer: false,
};

async function _fetchPublishedDevotionals(): Promise<Devotional[]> {
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .eq('is_published', true)
    .order('day_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

export function getPublishedDevotionals(): Promise<Devotional[]> {
  return cachedDevotionals(_fetchPublishedDevotionals);
}

async function _fetchDevotionalByDay(dayNumber: number): Promise<Devotional | null> {
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .eq('day_number', dayNumber)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function getDevotionalByDay(dayNumber: number): Promise<Devotional | null> {
  return cachedDevotionalByDay(dayNumber, () => _fetchDevotionalByDay(dayNumber));
}

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
