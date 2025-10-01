import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type LoginPayload = {
  username: string;
  password: string;
};

const sanitizeUser = (user: { password: string } & Record<string, unknown>) => {
  const { password, ...rest } = user;
  return rest;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LoginPayload>;

    if (!body.username || !body.password) {
      return NextResponse.json({ message: 'username and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user || user.password !== body.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ message: 'User is not active' }, { status: 403 });
    }

    return NextResponse.json({ user: sanitizeUser(user), message: 'Login successful' });
  } catch (error) {
    console.error('Error during login', error);
    return NextResponse.json({ message: 'Error during login' }, { status: 500 });
  }
}
