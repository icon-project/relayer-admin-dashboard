import { addUser, deleteUser, getUserById, readUsers, updateUser } from '@/utils/user';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      const user = await getUserById(id);
      return Response.json(user);
    } else {
      const users = await readUsers();
      return Response.json(users);
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newUser = await req.json();
    const addedUser = await addUser(newUser);
    return Response.json(addedUser, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const updatedUser = await req.json();
    const foundUser = await getUserById(updatedUser.id);
    const user = await updateUser({ ...foundUser, ...updatedUser, id: foundUser.id });
    return Response.json(user);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }
    const user = await getUserById(id);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    await deleteUser(id);
    return Response.json({ message: 'User deleted' });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}