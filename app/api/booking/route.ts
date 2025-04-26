import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'booking-response.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const bookingResponse = JSON.parse(fileContents);
    
    return NextResponse.json(bookingResponse);
  } catch (error) {
    console.error('Error reading booking response:', error);
    return NextResponse.json(
      { error: 'Failed to read booking response' },
      { status: 500 }
    );
  }
} 