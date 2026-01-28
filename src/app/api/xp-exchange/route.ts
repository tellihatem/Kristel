import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { xpAmount } = await req.json();

    if (!xpAmount || isNaN(Number(xpAmount)) || Number(xpAmount) <= 0) {
      return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 });
    }

    // Exchange rate: 1 XP = $0.10 Virtual Balance
    const EXCHANGE_RATE = 0.10;
    const balanceGain = Number(xpAmount) * EXCHANGE_RATE;

    const result = await prisma.$transaction(async (tx: any) => {
      const currentUser = await tx.user.findUnique({
        where: { id: user.id },
      });

      if (!currentUser) throw new Error('User not found');
      if (currentUser.xp < xpAmount) {
        throw new Error('Insufficient XP');
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          xp: { decrement: xpAmount },
          virtualBalance: { increment: balanceGain },
        },
      });

      return updatedUser;
    });

    return NextResponse.json({ 
      success: true, 
      xpRemoved: xpAmount, 
      balanceAdded: balanceGain,
      newBalance: result.virtualBalance,
      newXp: result.xp
    });
  } catch (error: any) {
    console.error('XP Exchange error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
