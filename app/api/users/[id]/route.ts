import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  params: {
    id: string;
  };
};

const sanitizeUser = (user: { password: string } & Record<string, unknown>) => {
  const { password, ...rest } = user;
  return rest;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(sanitizeUser(user));
  } catch (error) {
    console.error('Error fetching user', error);
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    const data: Record<string, unknown> = {};

    if (typeof body.email === 'string') data.email = body.email;
    if (typeof body.password === 'string') data.password = body.password;
    if (typeof body.username === 'string') data.username = body.username;
    if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: 'No valid fields provided for update' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(sanitizeUser(user));
  } catch (error) {
    console.error('Error updating user', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = Number(params.id);

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid user id' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
