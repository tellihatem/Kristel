import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getServerSession();
    
    // Fetch top 100 users by XP
    const topUsers = await prisma.user.findMany({
      orderBy: {
        xp: 'desc',
      },
      take: 100,
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
        virtualBalance: true,
      },
    });

    return NextResponse.json({
      leaderboard: topUsers,
      currentUserRank: session ? topUsers.findIndex((u: any) => u.id === session.id) + 1 : null,
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
