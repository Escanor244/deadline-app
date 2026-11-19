import { NextResponse } from 'next/server';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = isMongoConfigured();
  if (!configured) {
    return NextResponse.json({
      connected: false,
      configured: false,
      mode: 'local_storage',
      message: 'Running in zero-backend mode (LocalStorage + JSON Export). To enable MongoDB cloud sync, add MONGODB_URI environment variable on Vercel.',
    });
  }

  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({
        connected: false,
        configured: true,
        mode: 'error',
        message: 'MONGODB_URI is set, but failed to connect to database.',
      });
    }

    // Ping test
    await db.command({ ping: 1 });

    return NextResponse.json({
      connected: true,
      configured: true,
      mode: 'mongodb_atlas',
      database: db.databaseName,
      message: 'Connected to MongoDB Atlas cloud database.',
    });
  } catch (error: unknown) {
    return NextResponse.json({
      connected: false,
      configured: true,
      mode: 'error',
      message: (error as Error).message || 'MongoDB connection failed',
    });
  }
}
