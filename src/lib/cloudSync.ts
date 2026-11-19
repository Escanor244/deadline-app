import { Deadline } from '@/types';

export interface DatabaseStatus {
  connected: boolean;
  configured: boolean;
  mode: 'mongodb_atlas' | 'local_storage' | 'error';
  database?: string;
  message: string;
}

/**
 * Checks serverless MongoDB status via API
 */
export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  try {
    const res = await fetch('/api/deadlines/status', { cache: 'no-store' });
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch {
    return {
      connected: false,
      configured: false,
      mode: 'local_storage',
      message: 'Running in zero-backend mode (LocalStorage + JSON Export).',
    };
  }
}

/**
 * Syncs a deadline to MongoDB cloud (if connected)
 */
export async function syncDeadlineToCloud(deadline: Deadline): Promise<boolean> {
  try {
    const res = await fetch('/api/deadlines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deadline),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/**
 * Exports all user deadlines as a clean, downloadable JSON file
 */
export function exportDeadlinesToJson(deadlines: Deadline[]): void {
  const dataStr = JSON.stringify(
    {
      app: 'Kairos Lockscreen Studio',
      exportedAt: new Date().toISOString(),
      version: '2.0',
      count: deadlines.length,
      deadlines,
    },
    null,
    2
  );

  const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateTag = new Date().toISOString().slice(0, 10);
  link.download = `kairos-deadlines-backup-${dateTag}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses and validates an uploaded JSON backup file
 */
export function importDeadlinesFromJson(file: File): Promise<Deadline[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        const list = Array.isArray(parsed) ? parsed : parsed.deadlines;

        if (Array.isArray(list) && list.length > 0 && list[0].id && list[0].title) {
          resolve(list);
        } else {
          reject(new Error('Invalid backup file format. Expected a list of deadlines.'));
        }
      } catch (err) {
        reject(new Error('Failed to parse JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsText(file);
  });
}

/**
 * Encodes a deadline into a URL-safe Base64 string for instant cross-device sharing
 */
export function encodeDeadlineForShareUrl(deadline: Deadline): string {
  try {
    const compactPayload = {
      t: deadline.title,
      c: deadline.category,
      d: deadline.targetDate,
      m: deadline.mantra,
      desc: deadline.description,
      ms: deadline.milestones.map((m) => ({
        t: m.title,
        p: m.pacingLabel,
        d: m.dueDate,
        h: m.estimatedHours,
      })),
    };
    const jsonStr = JSON.stringify(compactPayload);
    // Base64 encode safe for URL
    return btoa(encodeURIComponent(jsonStr));
  } catch {
    return '';
  }
}

/**
 * Decodes a share URL string back into a full Deadline object
 */
export function decodeDeadlineFromShareUrl(encoded: string): Deadline | null {
  try {
    const jsonStr = decodeURIComponent(atob(encoded));
    const raw = JSON.parse(jsonStr);

    if (!raw.t || !raw.d) return null;

    const deadline: Deadline = {
      id: `shared-${Date.now()}`,
      title: raw.t,
      category: raw.c || 'launch',
      targetDate: raw.d,
      createdAt: new Date().toISOString(),
      mantra: raw.m || 'Focus on the finish line.',
      description: raw.desc || 'Shared high-priority milestone project.',
      milestones: Array.isArray(raw.ms)
        ? raw.ms.map((m: any, idx: number) => ({
            id: `ms-shared-${idx + 1}`,
            title: m.t,
            pacingLabel: m.pacing || `Phase ${idx + 1}`,
            dueDate: m.d || raw.d,
            estimatedHours: m.h || 2,
            completed: false,
            description: 'Milestone checkpoint',
          }))
        : [],
    };

    return deadline;
  } catch {
    return null;
  }
}
