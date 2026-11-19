import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';
import {
  getDeadlinesFromJsonDb,
  saveDeadlineToJsonDb,
  deleteDeadlineFromJsonDb,
} from '@/lib/jsonDb';
import { Deadline } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // 1. Try MongoDB if explicitly configured
    if (isMongoConfigured()) {
      const db = await getMongoDb();
      if (db) {
        const collection = db.collection<Deadline>('deadlines');
        if (id) {
          const single = await collection.findOne({ id });
          if (!single) {
            return NextResponse.json({ error: 'Deadline not found' }, { status: 404 });
          }
          return NextResponse.json({ connected: true, source: 'mongodb', deadline: single });
        }

        const deadlines = await collection.find({}).sort({ createdAt: -1 }).limit(50).toArray();
        return NextResponse.json({
          connected: true,
          source: 'mongodb',
          count: deadlines.length,
          deadlines,
        });
      }
    }

    // 2. Default & primary repo storage: local JSON file (data/deadlines.json)
    const deadlines = await getDeadlinesFromJsonDb();

    if (id) {
      const single = deadlines.find((d) => d.id === id);
      if (!single) {
        return NextResponse.json({ error: 'Deadline not found' }, { status: 404 });
      }
      return NextResponse.json({ connected: true, source: 'json_file', deadline: single });
    }

    return NextResponse.json({
      connected: true,
      source: 'json_file',
      count: deadlines.length,
      deadlines,
    });
  } catch (error: unknown) {
    console.error('API /api/deadlines GET error:', error);
    return NextResponse.json(
      { connected: false, error: (error as Error).message || 'Database query error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Deadline = await request.json();

    if (!body || !body.id || !body.title) {
      return NextResponse.json({ error: 'Invalid deadline payload' }, { status: 400 });
    }

    // Always persist to local repository JSON database (data/deadlines.json)
    const saved = await saveDeadlineToJsonDb(body);

    // If MongoDB is configured, sync to it as well
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const collection = db.collection<Deadline>('deadlines');
          await collection.updateOne(
            { id: body.id },
            {
              $set: {
                id: body.id,
                title: body.title,
                category: body.category,
                targetDate: body.targetDate,
                createdAt: body.createdAt,
                description: body.description,
                mantra: body.mantra,
                milestones: body.milestones,
                updatedAt: new Date().toISOString(),
              },
            },
            { upsert: true }
          );
        }
      } catch (mongoErr) {
        console.warn('MongoDB sync warning (persisted to jsonDb):', mongoErr);
      }
    }

    return NextResponse.json({
      success: true,
      source: isMongoConfigured() ? 'mongodb_and_json' : 'json_file',
      deadline: saved,
    });
  } catch (error: unknown) {
    console.error('API /api/deadlines POST error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to save deadline' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing deadline id parameter' }, { status: 400 });
    }

    // Delete from local repository JSON database
    await deleteDeadlineFromJsonDb(id);

    // Also delete from MongoDB if configured
    if (isMongoConfigured()) {
      try {
        const db = await getMongoDb();
        if (db) {
          const collection = db.collection<Deadline>('deadlines');
          await collection.deleteOne({ id });
        }
      } catch (mongoErr) {
        console.warn('MongoDB delete warning:', mongoErr);
      }
    }

    return NextResponse.json({ success: true, deleted: id });
  } catch (error: unknown) {
    console.error('API /api/deadlines DELETE error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete deadline' },
      { status: 500 }
    );
  }
}
