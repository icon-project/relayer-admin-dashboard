import { addRelayer, deleteRelayer, readRelayers, updateRelayer } from '@/utils/relayer';
import crypto from 'crypto';
export async function GET(req: Request) {
  try {
    const relayers = await readRelayers();
    const id = new URLSearchParams(req.url).get('id');
    if (id) {
      const relayer = relayers.find((r) => r.id === id);
      if (!relayer) {
        return Response.json({ error: 'Relayer not found' }, { status: 404 });
      }
      return Response.json(relayer);
    }
    return Response.json(relayers);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const newRelayer = await req.json();
    const id = crypto.randomUUID();
    const addedRelayer = await addRelayer({ ...newRelayer, id });
    return Response.json(addedRelayer, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const updatedRelayer = await req.json();
    const relayers = await readRelayers();
    const relayer = relayers.find((r) => r.id === updatedRelayer.id);
    if (!relayer) {
      return Response.json({ error: 'Relayer not found' }, { status: 404 });
    }
    const updated = await updateRelayer({ ...relayer, ...updatedRelayer });
    return Response.json(updated);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 });
    }
    const relayers = await readRelayers();
    const relayer = relayers.find((r) => r.id === id);
    if (!relayer) {
      return Response.json({ error: 'Relayer not found' }, { status: 404 });
    }
    await deleteRelayer(id!);
    return Response.json({ message: 'Relayer deleted' });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}