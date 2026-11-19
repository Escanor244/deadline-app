import fs from 'fs/promises';
import path from 'path';
import { Deadline } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'deadlines.json');

// In-memory cache fallback for environments with restricted filesystem
let memoryStore: Deadline[] | null = null;

async function ensureDataFile(): Promise<string> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // File does not exist, initialize with empty array
      await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    return DB_FILE;
  } catch (err) {
    console.warn('Warning: Could not access local data directory, using in-memory store:', err);
    return '';
  }
}

/**
 * Loads all deadlines from data/deadlines.json
 */
export async function getDeadlinesFromJsonDb(): Promise<Deadline[]> {
  try {
    await ensureDataFile();
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    memoryStore = list;
    return list;
  } catch (err) {
    console.warn('Error reading data/deadlines.json, falling back to memory store:', err);
    return memoryStore || [];
  }
}

/**
 * Saves or updates a single deadline in data/deadlines.json
 */
export async function saveDeadlineToJsonDb(deadline: Deadline): Promise<Deadline> {
  const current = await getDeadlinesFromJsonDb();
  const index = current.findIndex((d) => d.id === deadline.id);

  let updated: Deadline[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = deadline;
  } else {
    updated = [deadline, ...current];
  }

  memoryStore = updated;

  try {
    await ensureDataFile();
    await fs.writeFile(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Warning: Could not write to data/deadlines.json, kept in memory:', err);
  }

  return deadline;
}

/**
 * Saves the entire array of deadlines to data/deadlines.json
 */
export async function saveAllDeadlinesToJsonDb(deadlines: Deadline[]): Promise<void> {
  memoryStore = deadlines;
  try {
    await ensureDataFile();
    await fs.writeFile(DB_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Warning: Could not write to data/deadlines.json, kept in memory:', err);
  }
}

/**
 * Deletes a deadline by id from data/deadlines.json
 */
export async function deleteDeadlineFromJsonDb(id: string): Promise<boolean> {
  const current = await getDeadlinesFromJsonDb();
  const filtered = current.filter((d) => d.id !== id);

  memoryStore = filtered;

  try {
    await ensureDataFile();
    await fs.writeFile(DB_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Warning: Could not write to data/deadlines.json after delete, kept in memory:', err);
    return true;
  }
}
