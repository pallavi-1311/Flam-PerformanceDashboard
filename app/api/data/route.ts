import { NextResponse } from 'next/server';
import { generateInitialDataset } from '@/lib/dataGenerator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10000');
  
  const data = generateInitialDataset(count);
  
  return NextResponse.json(data);
}