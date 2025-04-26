import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'itinerary.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const itinerary = JSON.parse(fileContents);
    
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error reading itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to read itinerary' },
      { status: 500 }
    );
  }
} 