import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';
import { Deadline } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({
        connected: false,
        source: 'local',
        message: 'MongoDB URI not configured. Application is using LocalStorage & client-side JSON sync.',
        deadlines: [],
      });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({
        connected: false,
        source: 'local',
        message: 'Could not connect to MongoDB database.',
        deadlines: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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
    if (!isMongoConfigured()) {
      return NextResponse.json(
        {
          connected: false,
          source: 'local',
          message: 'MongoDB not configured. Data safely kept in browser LocalStorage.',
        },
        { status: 200 }
      );
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const body: Deadline = await request.json();

    if (!body || !body.id || !body.title) {
      return NextResponse.json({ error: 'Invalid deadline payload' }, { status: 400 });
    }

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

    return NextResponse.json({
      success: true,
      connected: true,
      id: body.id,
      message: 'Deadline saved to MongoDB cloud successfully.',
    });
  } catch (error: unknown) {
    console.error('API /api/deadlines POST error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to save to MongoDB' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({ message: 'MongoDB not configured' }, { status: 200 });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing deadline id parameter' }, { status: 400 });
    }

    const collection = db.collection<Deadline>('deadlines');
    await collection.deleteOne({ id });

    return NextResponse.json({ success: true, message: `Deleted deadline ${id} from MongoDB` });
  } catch (error: unknown) {
    console.error('API /api/deadlines DELETE error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete from MongoDB' },
      { status: 500 }
    );
  }
}
