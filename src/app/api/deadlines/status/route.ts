import { NextResponse } from 'next/server';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = isMongoConfigured();

  if (configured) {
    try {
      const db = await getMongoDb();
      if (db) {
        // Ping test
        await db.command({ ping: 1 });

        return NextResponse.json({
          connected: true,
          configured: true,
          mode: 'mongodb_atlas',
          database: db.databaseName,
          message: 'Connected to MongoDB Atlas cloud database.',
        });
      }
    } catch (error: unknown) {
      console.warn('MongoDB connection check failed, falling back to local JSON db:', error);
    }
  }

  // Local repository JSON file database is always available and active
  return NextResponse.json({
    connected: true,
    configured: true,
    mode: 'json_file',
    database: 'data/deadlines.json',
    message: 'Local JSON database active in repo (data/deadlines.json).',
  });
}
