// ============================================
// DEVOTIONAL APP - TYPE DEFINITIONS
// ============================================

export interface Devotional {
  id: string;
  day_number: number;
  title: string;
  date: string;
  bible_passage_reference: string;
  bible_passage_text: string;
  text_questions: string[];
  meditation_questions: string[];
  prayer_text: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DevotionalFormData {
  day_number: number;
  title: string;
  date: string;
  bible_passage_reference: string;
  bible_passage_text: string;
  text_questions: string[];
  meditation_questions: string[];
  prayer_text: string;
  is_published: boolean;
}

export interface UserProgress {
  id: string;
  device_id: string;
  devotional_id: string;
  completed_steps: CompletedSteps;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompletedSteps {
  passage: boolean;
  textQuestions: boolean;
  meditation: boolean;
  prayer: boolean;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

// Devotional step types for stepper navigation
export type DevotionalStep = 'passage' | 'textQuestions' | 'meditation' | 'prayer';

export const DEVOTIONAL_STEPS: { key: DevotionalStep; label: string; icon: string }[] = [
  { key: 'passage', label: 'Pasaj Biblic', icon: 'book-open' },
  { key: 'textQuestions', label: 'Întrebări din Text', icon: 'help-circle' },
  { key: 'meditation', label: 'Meditație', icon: 'heart' },
  { key: 'prayer', label: 'Rugăciune', icon: 'hands' },
];
