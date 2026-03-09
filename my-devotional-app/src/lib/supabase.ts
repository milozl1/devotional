import { createClient } from '@supabase/supabase-js';
import { getDeviceId } from './utils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const hasValidConfig =
  /^https?:\/\//.test(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes('your-') &&
  !supabaseAnonKey.includes('your-');
const effectiveSupabaseUrl = hasValidConfig ? supabaseUrl : 'http://127.0.0.1:54321';
const effectiveSupabaseAnonKey = hasValidConfig ? supabaseAnonKey : 'public-anon-key';

if (!hasValidConfig) {
  console.warn(
    '⚠️ Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

const deviceIdHeader: Record<string, string> =
  typeof window !== 'undefined' ? { 'x-device-id': getDeviceId() } : {};

export const supabase = createClient(effectiveSupabaseUrl, effectiveSupabaseAnonKey, {
  global: {
    headers: deviceIdHeader,
  },
});
