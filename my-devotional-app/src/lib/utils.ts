// Generate or retrieve a unique device ID for tracking progress
export function getDeviceId(): string {
  const KEY = 'devotional_device_id';

  if (typeof window === 'undefined') {
    return 'server-device';
  }

  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

// Format date in Romanian style
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ro-RO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Get short date
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
  });
}

// cn utility for conditional classnames
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
