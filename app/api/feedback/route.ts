import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'feedback.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const feedback = JSON.parse(fileContents);
    
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error reading feedback:', error);
    return NextResponse.json(
      { error: 'Failed to read feedback' },
      { status: 500 }
    );
  }
} 