import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const relayersFilePath = path.resolve(process.cwd(), 'relayers.json');

const readRelayers = () => {
  const data = fs.readFileSync(relayersFilePath, 'utf8');
  return JSON.parse(data);
};

const writeRelayers = (data: any) => {
  fs.writeFileSync(relayersFilePath, JSON.stringify(data, null, 2), 'utf8');
};

export async function GET(req: NextRequest) {
  try {
    const relayers = readRelayers();
    return NextResponse.json(relayers);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newRelayer = await req.json();
    const relayersData = readRelayers();
    relayersData.push(newRelayer);
    writeRelayers(relayersData);
    return NextResponse.json(newRelayer, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedRelayer = await req.json();
    const relayersList = readRelayers();
    const index = relayersList.findIndex((r: any) => r.id === updatedRelayer.id);
    if (index !== -1) {
      relayersList[index] = updatedRelayer;
      writeRelayers(relayersList);
      return NextResponse.json(updatedRelayer);
    } else {
      return NextResponse.json({ error: 'Relayer not found' }, { status: 404 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const relayersArray = readRelayers();
    const filteredRelayers = relayersArray.filter((r: any) => r.id !== id);
    writeRelayers(filteredRelayers);
    return NextResponse.json({ message: 'Relayer deleted' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}