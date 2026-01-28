import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramAuth } from '@/lib/telegram-auth';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    if (!validateTelegramAuth(userData, BOT_TOKEN)) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(userData.id) },
      update: {
        username: userData.username,
      },
      create: {
        telegramId: BigInt(userData.id),
        username: userData.username,
        virtualBalance: 10000.00,
        xp: 0,
        level: 1,
      },
    });

    // Create JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        telegramId: user.telegramId.toString(),
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json(
      { success: true, user: { id: user.id, username: user.username } },
      { headers: { 'Set-Cookie': cookie } }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
