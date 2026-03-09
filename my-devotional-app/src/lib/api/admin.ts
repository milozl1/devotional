import { supabase } from '../supabase';
import type { AdminProfile, Devotional, DevotionalFormData } from '../../types';
import { invalidateDevotionals } from '../cache';

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAllDevotionals(): Promise<Devotional[]> {
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .order('day_number', { ascending: true });

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
