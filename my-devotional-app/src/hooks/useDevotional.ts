import { useState, useEffect, useCallback } from 'react';
import {
  getPublishedDevotionals,
  getDevotionalByDay,
  getAllUserProgress,
  getUserProgress,
  updateStepProgress,
} from '../lib/api/public';
import type { Devotional, UserProgress, CompletedSteps } from '../types';

// Hook to get all published devotionals
export function useDevotionals() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPublishedDevotionals();
      setDevotionals(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcare');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { devotionals, loading, error, refetch: fetch };
}

// Hook to get a single devotional by day number
export function useDevotional(dayNumber: number) {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const data = await getDevotionalByDay(dayNumber);
        setDevotional(data);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Eroare la încărcare');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [dayNumber]);

  return { devotional, loading, error };
}

// Hook to manage progress for a specific devotional
export function useProgress(devotionalId: string | undefined) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!devotionalId) return;
    async function fetch() {
      try {
        setLoading(true);
        const data = await getUserProgress(devotionalId!);
        setProgress(data);
      } catch {
        // Progress doesn't exist yet, that's fine
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [devotionalId]);

  const markStep = useCallback(
    async (step: keyof CompletedSteps, value: boolean = true) => {
      if (!devotionalId) return;
      try {
        const updated = await updateStepProgress(devotionalId, step, value);
        setProgress(updated);
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    },
    [devotionalId]
  );

  return { progress, loading, markStep };
}

// Hook to get all progress for overview
export function useAllProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const data = await getAllUserProgress();
        const map: Record<string, UserProgress> = {};
        data.forEach((p) => {
          map[p.devotional_id] = p;
        });
        setProgressMap(map);
      } catch {
        // No progress yet
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return { progressMap, loading };
}
