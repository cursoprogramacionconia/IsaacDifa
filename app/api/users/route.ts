import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type UserPayload = {
  email: string;
  password: string;
  username: string;
  isActive?: boolean;
};

const sanitizeUser = (user: { password: string } & Record<string, unknown>) => {
  const { password, ...rest } = user;
  return rest;
};

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users.map(sanitizeUser));
  } catch (error) {
    console.error('Error fetching users', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<UserPayload>;

    if (!body.email || !body.password || !body.username) {
      return NextResponse.json({ message: 'email, password and username are required' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        username: body.username,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(sanitizeUser(user), { status: 201 });
  } catch (error) {
    console.error('Error creating user', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
