import { createClient } from '@supabase/supabase-js';
import { getDeviceId } from './utils';

// Supabase anon key is public by design (RLS protects data).
// Environment variables override these defaults for local development.
const FALLBACK_URL = 'https://tawlpjsclohdvhyaiciv.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2xwanNjbG9oZHZoeWFpY2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNDUyNDYsImV4cCI6MjA4ODYyMTI0Nn0.b4B-fI1SVtohUqlsGe06-c_7J2C191hiUTl094cwSTk';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

const deviceIdHeader: Record<string, string> =
  typeof window !== 'undefined' ? { 'x-device-id': getDeviceId() } : {};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: deviceIdHeader,
  },
});
