import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, you'd check for an admin flag on the user
    // For now, we'll just allow fetching the config
    const config = await prisma.systemConfig.findUnique({
      where: { id: 'config' },
    });

    if (!config) {
      // Initialize if not exists
      const newConfig = await prisma.systemConfig.create({
        data: {
          id: 'config',
          xpPerTrade: 10,
          initialBalance: 10000.00,
        },
      });
      return NextResponse.json(newConfig);
    }

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { xpPerTrade, initialBalance } = body;

    const config = await prisma.systemConfig.upsert({
      where: { id: 'config' },
      update: {
        xpPerTrade: xpPerTrade ? Number(xpPerTrade) : undefined,
        initialBalance: initialBalance ? Number(initialBalance) : undefined,
      },
      create: {
        id: 'config',
        xpPerTrade: Number(xpPerTrade) || 10,
        initialBalance: Number(initialBalance) || 10000.00,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
