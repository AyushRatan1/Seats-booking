import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'seats.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    return NextResponse.json({ selectedSeats: [], sessions: {} });
  }
}

export async function POST(request: Request) {
  try {
    const { selectedSeats, sessionId, seatId } = await request.json();
    
    // Read existing data
    let data = { selectedSeats: [], sessions: {} };
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is invalid, use default empty data
    }

    // Update the data
    if (selectedSeats.includes(seatId)) {
      // Seat was added
      data.sessions[seatId] = sessionId;
    } else {
      // Seat was removed
      delete data.sessions[seatId];
    }
    
    data.selectedSeats = selectedSeats;

    // Write the updated data back to the file
    await fs.writeFile(dataFilePath, JSON.stringify(data));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update seats' },
      { status: 500 }
    );
  }
} 