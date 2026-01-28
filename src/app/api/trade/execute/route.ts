import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { symbol, type, amount, price } = await req.json();

    if (!symbol || !type || !amount || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalCost = Number(amount) * Number(price);

    // Start a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Refresh user data from DB within transaction
      const currentUser = await tx.user.findUnique({
        where: { id: user.id },
      });

      if (!currentUser) throw new Error('User not found');

      if (type === 'BUY') {
        if (Number(currentUser.virtualBalance) < totalCost) {
          throw new Error('Insufficient balance');
        }

        // Deduct balance and create trade
        await tx.user.update({
          where: { id: user.id },
          data: {
            virtualBalance: { decrement: totalCost },
            xp: { increment: 10 }, // Basic XP gain per trade
          },
        });
      } else if (type === 'SELL') {
        // In a real app, we'd check if they have the asset to sell
        // For this virtual trade bot, we'll just allow selling and adding to balance
        await tx.user.update({
          where: { id: user.id },
          data: {
            virtualBalance: { increment: totalCost },
            xp: { increment: 10 },
          },
        });
      } else {
        throw new Error('Invalid trade type');
      }

      const trade = await tx.trade.create({
        data: {
          userId: user.id,
          symbol,
          type,
          amount,
          price,
        },
      });

      return trade;
    });

    return NextResponse.json({ success: true, trade: result });
  } catch (error: any) {
    console.error('Trade execution error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
