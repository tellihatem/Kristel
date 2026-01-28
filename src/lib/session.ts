import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function getServerSession() {
  const token = cookies().get('auth_token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        _count: {
          select: { trades: true }
        }
      }
    });

    return user;
  } catch (error) {
    return null;
  }
}
